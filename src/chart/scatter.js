/**
 * @return {Object}
 */
glimma.chart.scatterChart = function() {
	var margin = {top: 20, right: 20, bottom: 50, left: 60},
		width = 500,
		height = 400,
		signif = 6,
		ndigits = null,
		xValue = function (d) { return d.x; },
		yValue = function (d) { return d.y; },
		idValue = function (d) { return d._uid; },
		searchValue = function (d) {return d.search; },
		idMap = function (d) { return d; },
		sizeValue = function () { return 2; }, //TODO: Maybe add size scale?
		cValue = function () { return "black"; },
		tooltip = ["x", "y"],
		tooltipAlt = [],
		titleValue = "",
		xLabel = "",
		yLabel = "",
		xJitter = 0,
		yJitter = 0,
		xScale = d3.scale.linear(),
		yScale = d3.scale.linear(),
		cScale = d3.scale.category10(),
		cFixed = false,
		colRefresh = false,
		holdTooltip = false,
		tooltipData = {},
		xLog = false,
		yLog = false,
		xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0),
		yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(6, 0),
		xGrid = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0),
		yGrid = d3.svg.axis().scale(yScale).orient("left").tickSize(6, 0),
		xGridStep = null,
		yGridStep = null,
		xGridOn = false,
		yGridOn = false,
		enableBrush = true;

	var dispatcher = d3.dispatch("hover", "leave", "click"),
		container,
		front,
		data,
		extent,
		xOrd,
		yOrd;

	function chart(selection) {
		var svg,
			brush;

		xOrd = typeof xScale.rangeBands === "function";
		yOrd = typeof yScale.rangeBands === "function";

		if (typeof selection.data()[0][0].xJitter === "undefined") {
			addJitter();
		}
		occupyContainer();
		getData();
		createScales();

		drawTitle();
		drawButtons();

		bindDataToSVG();

		drawSkeleton();
		if (!xOrd && !yOrd && enableBrush) {
			drawBrush();
		}
		drawPoints();
		drawAxis();

		bindDispatcher();

		function addJitter() {
			selection.data()[0] = selection.data()[0].map(function(d) {
				d.xJitter = (Math.random() - 0.5) * xJitter;
				d.yJitter = (Math.random() - 0.5) * yJitter;
				return d;
			});
		}

		function occupyContainer() {
			chart.container = container = selection;
			container.classed("available", false); // Mark plot window as occupied.
		}

		function getData() {
			data = data || selection.data()[0]; // Grab data from plot window
		}

		function createScales() {
			extent = extent || {"x": _scaled_extent(data, xValue, xLog ? 0 : 0.02),
								"y": _scaled_extent(data, yValue, yLog ? 0 : 0.02)};
			// Scale initialisation
			xScale.domain(extent.x).range([0, width - margin.left - margin.right]);
			yScale.domain(extent.y).range([height - margin.top - margin.bottom, 0]);

			if (xOrd) {
				xScale.domain(data.map(xValue).unique())
					.rangePoints([0, width - margin.left - margin.right], 1);
			}

			if (yOrd) {
				yScale.domain(data.map(yValue).unique())
					.rangePoints([height - margin.top - margin.bottom, 0], 1);
			}

			if (cFixed) {
				cScale = function (d) { return d; };
			} else if ((cScale.domain() == []) || colRefresh) {
				cScale.domain(data.map(function (d) { return cValue(d); }).unique());
				colRefresh = false;
			}
		}

		function drawTitle() {
			// Select title div if it exists, otherwise create it
			var titleDiv = selection.select(".title");
			if (titleDiv.node() === null) {
				titleDiv = selection.append("div")
										.attr("class", "title center-align")
										.style("width", width + "px")
										.html(titleValue);
			} else {
				titleDiv.html(titleValue);
			}
		}

		function drawButtons() {
			// Select the gutter and add reset zoom button
			var gutter = selection.select(".gutter");
			if (gutter.node() === null) {
				gutter = selection.append("div")
										.attr("class", "gutter left-align");
				gutter.append("button")
						.attr("class", "reset-button")
						.html("Reset Zoom")
						.on("click", _resetScale)
						.style("opacity", 0)
						.style("pointer-events", "none")
						.style("left", xScale.range()[1] + "px");
			}
		}

		function bindDataToSVG() {
			// Bind data to SVG if it exists
			svg = selection.selectAll("svg").data([data]);
		}

		function drawSkeleton() {
			// Create the skeletal chart.
			var gEnter = svg.enter().append("svg").attr("class", "plot-svg").append("g");

			gEnter.append("g").attr("class", "brush"); // brush
			gEnter.append("g").attr("class", "brush-cover"); // brush

			gEnter.append("g").attr("class", "x grid"); // x grid
			gEnter.append("g").attr("class", "y grid"); // y grid

			gEnter.append("g").attr("class", "circle-container"); // circle container

			gEnter.append("g").attr("class", "x axis"); // x axis
			gEnter.append("g").attr("class", "x label center-align"); // x label

			gEnter.append("g").attr("class", "y axis"); // y axis
			gEnter.append("g").attr("class", "y label center-align"); // x label

			gEnter.append("g").attr("class", "front"); // front layer

			if (container.select(".tooltip").node() === null) {
				container.append("div").attr("class", "tooltip").style("opacity", 0); // tooltip
			}
			// Update the inner dimensions.
			svg.select("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// Update the outer dimensions.
			svg.attr("width", width)
				.attr("height", height);

			front = container.select(".front");
		}

		function drawBrush() {
			// Create brush object
			brush = d3.svg.brush().x(xScale).y(yScale).on("brushend", _brushend);
			svg.select(".brush").call(brush);
			svg.select("rect.extent")
				.style("cursor", "crosshair")
				.style("pointer-events", "none");

			// Brush function
			function _brushend() {
				_lowlight();
				if (!brush.empty()) {
					var extent = brush.extent();
					svg.select(".brush").call(brush.clear());
					_rescale(extent);
				}
			}
		}

		function drawPoints() {
			var cirContainer;
			if (typeof idValue(data[0]) !== "undefined") {
				cirContainer = svg.select(".circle-container")
									.selectAll("circle")
									.data(data, function(d) { return idValue(d); });
			} else {

				cirContainer = svg.select(".circle-container")
									.selectAll("circle")
									.data(data, function(d) {
										var xval = glimma.math.signif(xValue(d), 3),
											yval = glimma.math.signif(yValue(d), 3);
										return [xval, yval];
									});
			}

			// Remove data points that no longer exist
			cirContainer.exit()
						.remove();

			// Add points for new data
			cirContainer.enter()
						.append("circle")
						.attr("class", "point")
						.attr("r", function (d) { return sizeValue(d); })
						.on("click", function (d) { dispatcher.click(d); })
						.on("mouseover", function (d) { dispatcher.hover(d); })
						.on("mouseout", function (d) { dispatcher.leave(d); });

			// Colour may change without new points
			cirContainer.style("fill", function (d) { return cScale(cValue(d)); });

			// Update positions
			if (cirContainer.node().childElementCount < 2000) {
				cirContainer.transition()
							.attr("cx", function (d) { return d.xJitter + xScale(xValue(d)); })
							.attr("cy", function (d) { return d.yJitter + yScale(yValue(d)); });
			} else {
				cirContainer.attr("cx", function (d) { return d.xJitter + xScale(xValue(d)); })
							.attr("cy", function (d) { return d.yJitter + yScale(yValue(d)); });
			}
		}

		function drawAxis() {
			var tallTextOffset = 6;

			// Update the axes.
			svg.select(".x.axis")
					.attr("transform", "translate(0," + yScale.range()[0] + ")")
					.transition()
					.call(xAxis);

			if (xGridOn) {
				if (xGridStep !== null) {
					svg.select(".x.grid")
						.attr("transform", "translate(0," + (height - margin.bottom - margin.top) + ")")
						.call(xGrid
							.tickSize(-(height - margin.bottom - margin.top), 0, 0)
							.tickFormat("")
						);
				} else {
					svg.select(".x.grid")
						.attr("transform", "translate(0," + (height - margin.bottom - margin.top) + ")")
						.call(xGrid
							.tickSize(-(height - margin.bottom - margin.top), 0, 0)
							.tickFormat("")
						);
				}
			}

			// Draw x label
			var xLabSel = svg.select(".x.label");
			if (xLabSel.node().childElementCount  === 0) {
				// If no label container is present
				xLabSel.append("text")
						.attr("class", "label-text")
						.attr("text-anchor", "middle")
						.attr("x", (width - margin.left) / 2)
						.attr("y", height - margin.top - tallTextOffset)
						.html(xLabel);
			} else {
				// Update label
				xLabSel.select("text")
						.html(xLabel);
			}


			svg.select(".y.axis")
					.transition()
					.call(yAxis);

			if (yGridOn) {
				if (yGridStep !== null) {
					svg.select(".y.grid")
					   .call(yGrid
							.tickValues(glimma.rangeSpan(yGrid.scale().domain(), yGridStep))
							.tickSize(-(width - margin.right - margin.left), 0, 0)
							.tickFormat("")
						);
				} else {
					svg.select(".y.grid")
					   .call(yGrid
							.tickSize(-(width - margin.right - margin.left), 0, 0)
							.tickFormat("")
						);
				}

			}

			// Draw y label
			var yLabSel = svg.select(".y.label");
			if (yLabSel.node().childElementCount  === 0) {
				// If no label container is present
				yLabSel.attr("transform", "rotate(-90)")
						.append("text")
						.attr("class", "label-text")
						.attr("text-anchor", "middle")
						.attr("x", - (height - margin.top - margin.bottom) / 2)
						.attr("y", - (margin.left / 1.5))
						.html(yLabel);
			} else {
				// Update label
				yLabSel.select("text")
						.html(yLabel);
			}
		}

		function bindDispatcher() {
			// Assign dispatcher events
			dispatcher.on("hover", function (d) { if (!holdTooltip) chart.hover(d); });
			dispatcher.on("leave", function (d) { chart.leave(d); });
			dispatcher.on("click", function (d) { chart.click(d); });
		}
	}

	//* Setters/getters *//
	chart.margin = function(_) {
		if (!arguments.length) return margin;
		margin = _;
		return chart;
	};

	chart.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return chart;
	};

	chart.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return chart;
	};

	chart.x = function(_) {
		if (!arguments.length) return xValue;
		xValue = _;
		return chart;
	};

	chart.xJitter = function(_) {
		if (!arguments.length) return xJitter;
		if (typeof _ === "number") {
			xJitter = _;
		}
		return chart;
	};

	chart.xlab = function(_) {
		if (!arguments.length) return xLabel;
		xLabel = _;
		return chart;
	};

	chart.y = function(_) {
		if (!arguments.length) return yValue;
		yValue = _;
		return chart;
	};

	chart.yJitter = function(_) {
		if (!arguments.length) return yJitter;
		if (typeof _ === "number") {
			yJitter = _;
		}
		return chart;
	};

	chart.ylab = function(_) {
		if (!arguments.length) return yLabel;
		yLabel = _;
		return chart;
	};

	chart.id = function(_) {
		if (!arguments.length) return idValue;
		idValue = _;
		return chart;
	};

	chart.searchValue = function(_) {
		if (!arguments.length) return searchValue;
		searchValue = _;
		return chart;
	};

	chart.idMap = function(_) {
		if (!arguments.length) return idMap;
		idMap = _;
		return chart;
	};

	chart.size = function(_) {
		if (!arguments.length) return sizeValue;
		sizeValue = _;
		return chart;
	};

	chart.col = function(_) {
		if (!arguments.length) return cValue;
		cValue = _;
		colRefresh = true;
		return chart;
	};

	chart.tooltip = function(_) {
		if (!arguments.length) return tooltip;
		tooltip = typeof _ === "string" ? [_] : _;
		if (tooltip.length !== tooltipAlt.length) {
			tooltipAlt = [];
		}
		return chart;
	};

	chart.tooltipLabels = function(_) {
		if (!arguments.length) return tooltipAlt;
		var temp = typeof _ === "string" ? [_] : _;
		if (temp.length === tooltip.length) {
			tooltipAlt = temp;
		}
		return chart;
	};

	chart.data = function(_) {
		if (!arguments.length) return data;
		data = _;
		return chart;
	};

	chart.extent = function(_) {
		if (!arguments.length) return extent;
		extent = _;
		return chart;
	};

	chart.title = function(_) {
		if (!arguments.length) return titleValue;
		titleValue = _;
		return chart;
	};

	chart.signif = function(_) {
		if (!arguments.length) return signif;
		if (+_ % 1 === 0) {
			signif = _;
		}
		return chart;
	};

	chart.ndigits = function(_) {
		if (!arguments.length) return ndigits;
		if (+_ % 1 === 0) {
			ndigits = _;
		}
		return chart;
	};

	chart.holdTooltip = function(_) {
		if (!arguments.length) return holdTooltip;
		if (typeof _ === "boolean") holdTooltip = _;
		return chart;
	};

	chart.fixedCol = function(_) {
		cFixed = _;
		if (_) {
			cScale = function (d) { return d; };
		} else {
			cScale = d3.scale.category10();
		}
		return chart;
	};

	chart.xIsOrdinal = function() {
		xScale = d3.scale.ordinal();
		xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0);
		return chart;
	};

	chart.yIsOrdinal = function() {
		yScale = d3.scale.ordinal();
		yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(6, 0);
		return chart;
	};

	chart.xIsLog = function() {
		xScale = d3.scale.log();
		xScale.ticks(10, ",.2f");
		xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0);
		xLog = true;
		return chart;
	};

	chart.yIsLog = function() {
		yScale = d3.scale.log();
		yScale.ticks(10, ",.2f");
		yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(6, 0);
		yLog = true;
		return chart;
	};

	chart.xIsLinear = function() {
		xScale = d3.scale.linear();
		xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0);
		xLog = false;
		return chart;
	};

	chart.yIsLinear = function() {
		yScale = d3.scale.linear();
		yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(6, 0);
		yLog = false;
		return chart;
	};

	chart.enableBrush = function(_) {
		if (!arguments.length) return enableBrush;
		if (typeof _ === "boolean") enableBrush = _;
		return chart;
	};

	chart.xGridOn = function(_) {
		if (!arguments.length) return xGridOn;
		if (typeof _ === "boolean") xGridOn = _;
		return chart;
	};

	chart.yGridOn = function(_) {
		if (!arguments.length) return yGridOn;
		if (typeof _ === "boolean") yGridOn = _;
		return chart;
	};

	chart.xGridStep = function(_) {
		if (!arguments.length) return xGridStep;
		if (typeof _ === "number") xGridStep = _;
		return chart;
	};

	chart.yGridStep = function(_) {
		if (!arguments.length) return yGridStep;
		if (typeof _ === "number") yGridStep = _;
		return chart;
	};

	chart._xScale = function() {
		return xScale;
	}

	chart._yScale = function() {
		return yScale;
	}

	//* Internal Functions *//
	function _deselect() {
		_hideTooltip();
		_lowlight();
		holdTooltip = false;
	}

	function _scaled_extent(data, key, factor) {
		factor = typeof factor !== "undefined" ? factor : 0.02;
		extent = d3.extent(data, key);
		range = extent[1] - extent[0];
		offset = (range == 0) ? extent[0] * factor : range * factor;

		return [extent[0] - offset, extent[1] + offset];
	}

	function _showTooltip(data) {
		// Remove existing tooltip
		container.select(".tooltip")
					.select("table")
					.remove();
		// Create table for tooltip
		var table = container.select(".tooltip")
								.append("table");
		// Populate tooltip
		for (var i=0; i<tooltip.length; i++) {
			var row = table.append("tr");

			// Property name
			if (tooltipAlt.length !== 0) {
				row.append("td").attr("class", "right-align tooltip-cell").html(tooltipAlt[i]);
			} else {
				row.append("td").attr("class", "right-align tooltip-cell").html(tooltip[i]);
			}

			// Property value
			if (typeof data[tooltip[i]] == "number") {
				if (ndigits === null) {
					row.append("td").attr("class", "left-align tooltip-cell")
									.html(glimma.math.signif(data[tooltip[i]], signif));
				} else {
					row.append("td").attr("class", "left-align tooltip-cell")
									.html(glimma.math.round(data[tooltip[i]], ndigits));
				}
			} else {
				row.append("td").attr("class", "left-align tooltip-cell").html(data[tooltip[i]]);
			}
		}

		container.select(".tooltip")
					.style("opacity", 1);

		function pxToNum(px) {
			return +px.replace("px", "");
		}

		tooltipLeft = data.xJitter + xScale(xValue(data));
		tooltipLeft += margin.left + margin.right;
		tooltipLeft += $(container.select("svg").node()).offset().left;
		tooltipLeft -= $(container.node()).offset().left;
		// Seperated from top style call so text height is calculated after proper
		// line wrapping.
		container.select(".tooltip")
					.style("left", tooltipLeft + "px");

		tooltipTop = data.yJitter + yScale(yValue(data));
		tooltipTop += margin.top + $(container.select("svg").node()).offset().top;
		tooltipTop -= 3 + $(container.select(".tooltip").node()).outerHeight();
		tooltipTop = tooltipTop < 0 ? 0 : tooltipTop;
		container.select(".tooltip")
					.style("top", tooltipTop + "px");
	}

	function _hideTooltip() {
		container.select(".tooltip")
					.style("opacity", 0);
		tooltipData = {};
	}

	function _highlight(data) {
		var c = front.select("circle");
		if (c[0][0] === null) {
			c = front.append("circle");
		}

		c.attr("cx", data.xJitter + xScale(xValue(data)))
			.attr("cy", data.yJitter + yScale(yValue(data)))
			.attr("r", sizeValue(data) + 4)
			.style("opacity", 1)
			.style("stroke", "black")
			.style("fill", cScale(cValue(data)));
	}

	function _lowlight() {
		front.selectAll("circle")
				.style("opacity", 0);
	}

	function _rescale(brushExtent) {
		var newData = container.data()[0].filter(function (d) { return _withinBrush(d, brushExtent); });
		if (newData.length > 0) {
			_deselect();
			container.select(".reset-button").style("opacity", 1).style("pointer-events", "auto");
			chart.data(newData);
			chart.extent({"x": [brushExtent[0][0], brushExtent[1][0]], "y": [brushExtent[0][1], brushExtent[1][1]]});
			container.call(chart);
		}
	}

	function _resetScale() {
		_deselect();
		chart.data(container.data()[0]);
		container.select(".reset-button").style("opacity", 0).style("pointer-events", "none");
		extent = null;
		container.call(chart);
	}

	function _withinBrush(point, extent) {
		var x = xValue(point),
			y = yValue(point);

		return (x >= extent[0][0] &&
				x <= extent[1][0] &&
				y >= extent[0][1] &&
				y <= extent[1][1]);
	}

	function _withinExtent(point, extent) {
		var x = xValue(point),
			y = yValue(point);

		return (x >= extent.x[0] &&
				x <= extent.x[1] &&
				y >= extent.y[0] &&
				y <= extent.y[1]);
	}

	//* Public Interactions *//
	chart.click = function(data) {
		if (JSON.stringify(data) === JSON.stringify(tooltipData)) {
			chart.holdTooltip(false);
		} else {
			chart.holdTooltip(true);
		}

		chart.hover(data);

		tooltipData = data;

		return chart;
	};

	chart.deselect = function() {
		_deselect();
	};

	chart.highlightById = function(id) {
		var selectedData = data.filter(function (d) {
			return (d._uid === id);
		});

		if (selectedData.length !== 0) {
			_deselect();
			dispatcher.hover(selectedData[0]);
		}
		return chart;
	};

	chart.highlightBySearch = function(query) {
		var selectedData = data.filter(function (d) {
			return (searchValue(d) === query);
		});

		if (selectedData.length !== 0) {
			_deselect();
			dispatcher.hover(selectedData[0]);
		}
		return chart;
	};

	chart.hide = function () {
		container.style("display", "none");
		return chart;
	};

	chart.hover = function(data) {
		if (_withinExtent(data, extent) || xOrd || yOrd) {
			_highlight(data);
			_showTooltip(data);
		}
		return chart;
	};

	chart.leave = function(data) {
		if (!holdTooltip) {
			if (_withinExtent(data, extent) || xOrd || yOrd) {
				_hideTooltip();
				_lowlight();
			}
		}
		return chart;
	};

	chart.refresh = function () {
		_deselect();
		extent = null;
		container.call(chart);
		return chart;
	};

	chart.rescale = function(extent) {
		_rescale(extent);
		return chart;
	};

	chart.show = function () {
		if (container.style("display") !== "block") {
			container.style("display", "block");
		}
		return chart;
	};

	chart.update = function() {
		container.call(chart);
		return chart;
	};

	chart.colorScale = function() {
		var dom = cScale.domain();
		var cols = dom.map(function (d) { return cScale(d); });
		function zip(a, b) {
			var out = [];
			if (a.length === b.length) {
				for (var i = 0; i < a.length; i++) {
					out.push([dom[i], cols[i]]);
				}
			}
		}
		return out;
	};

	d3.rebind(chart, dispatcher, "on");

	return chart;
};
