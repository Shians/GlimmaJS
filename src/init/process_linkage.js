// Function to process the action linkages between charts

glimma.init.processLinkages = function () {
	for (var i = 0; i < glimma.storage.linkage.length; i++) {
		// Closure to retain the indices
		(function () {
			var chartNum = i;

			var srcChart = getLinkageInfo(chartNum, "from");
			var destChart = getLinkageInfo(chartNum, "to");

			var flag = getLinkageInfo(chartNum, "flag");

			var srcAction, destAction;

			if (flag !== "mds") {
				srcAction = getLinkageInfo(chartNum, "src");
				destAction = getLinkageInfo(chartNum, "dest");
			}

			var key;

			// Special mds linkage
			if (flag === "mds") {
				glimma.get.chart(srcChart).container.selectAll("rect.bar").classed("clickable", true);
				glimma.get.chart(srcChart).lowlightAll();
				glimma.get.chart(srcChart).highlightBar([1, 2]);

				glimma.get.chart(srcChart).on("click.mds", updateDimensions);
				glimma.get.chart(srcChart).on("hover.mds", highlightDimensions);
				glimma.get.chart(srcChart).on("leave.mds", resetBarHighlights);

				var groupNames = glimma.storage.chartInfo[0].info.groupsNames;

				if (typeof groupNames === "object") {
					drawMultiGroups(groupNames);
				}

			} else if (flag === "byKey") {

				key = getLinkageInfo(chartNum, "info");

				if (destAction === "xChange") {
					if (srcAction === "click") {
						glimma.storage.charts[srcChart].on(srcAction + ".chart" + srcChart, function (d) {
							var updateKey = glimma.makeNames(d[key]); // Append X if starts with number

							glimma.storage.charts[destChart].x(function (d) { return d[updateKey]; })
														.title(String(d[key]))
														.tooltip(["Sample", updateKey])
														.refresh()
														.show();
						});
					} else {
						glimma.storage.charts[srcChart].on(srcAction + ".chart" + srcChart, function (d) {
							if (!glimma.storage.charts[srcChart].holdTooltip()) {
								var updateKey = glimma.makeNames(d[key]); // Append X if starts with number

								glimma.storage.charts[destChart].x(function (d) { return d[updateKey]; })
															.title(String(d[key]))
															.tooltip(["Sample", updateKey])
															.refresh()
															.show();
							}
						});
					}
				} else if (destAction === "yChange") {
					if (srcAction === "click") {
						glimma.storage.charts[srcChart].on(srcAction + ".chart" + srcChart, function (d) {
							var updateKey = glimma.makeNames(d[key]); // Append X if starts with number

							glimma.storage.charts[destChart].y(function (d) { return d[updateKey]; })
														.title(String(d[key]))
														.tooltip(["Sample", updateKey])
														.refresh()
														.show();
						});
					} else {
						glimma.storage.charts[srcChart].on(srcAction + ".chart" + srcChart, function (d) {
							if (!glimma.storage.charts[srcChart].holdTooltip()) {
								var updateKey = glimma.makeNames(d[key]); // Append X if starts with number

								glimma.storage.charts[destChart].y(function (d) { return d[updateKey]; })
															.title(String(d[key]))
															.tooltip(["Sample", updateKey])
															.refresh()
															.show();
							}
						});
					}
				}
			// Table linkage
			} else if (flag === "tablink") {
				glimma.get.table(srcChart).on(srcAction + ".chart" + srcChart, function (d) {
					glimma.get.chart(destChart)[destAction](d);
				});

				glimma.get.chart(destChart).on(srcAction + ".table" + destChart, function (d) {
					glimma.get.table(srcChart)[destAction](d);
				});
			// Default linkage
			} else {
				glimma.storage.charts[srcChart].on(srcAction + ".chart" + srcChart, function (d) {
					glimma.storage.charts[destChart][destAction](d);
				});

				if (destAction == "hover" && destAction == "hover") {
					glimma.storage.charts[srcChart].on("leave" + ".chart" + srcChart, function (d) {
						glimma.storage.charts[destChart].leave(d);
					});
				}
			}

			function updateDimensions(d) {
				var maxDim = glimma.get.chartInfo(srcChart).info.dims;

				if (withinMDSBound(d.name, maxDim)) {
					if (d.name !== Math.min(maxDim, 8)) {
						var firstDimVal = d.name;
						var secondDimVal = d.name + 1;
					} else {
						var firstDimVal = d.name - 1;
						var secondDimVal = d.name;
					}

					(function () {
						var firstDimKey = "dim" + firstDimVal;
						var firstDimLabel = "Dimension " + firstDimVal;

						var secondDimKey = "dim" + secondDimVal;
						var secondDimlabel = "Dimension " + secondDimVal;

						var old = glimma.storage.charts[destChart].tooltip().slice(0, -2);

						glimma.get.chart(srcChart).lowlightAll();
						glimma.get.chart(srcChart).highlightBar([firstDimVal, secondDimVal]);

						glimma.storage.charts[destChart]
								.x(function (d) { return d[firstDimKey]; })
								.xlab(firstDimLabel)
								.y(function (d) { return d[secondDimKey]; })
								.ylab(secondDimlabel)
								.tooltip(old.concat([firstDimKey, secondDimKey]));
					}());
					glimma.storage.charts[destChart].refresh();
				}
			}

			function highlightDimensions(d) {
				var maxDim = glimma.get.chartInfo(srcChart).info.dims;

				if (d.name !== Math.min(maxDim, 8)) {
					var firstDimVal = d.name;
					var secondDimVal = d.name + 1;
				} else {
					var firstDimVal = d.name - 1;
					var secondDimVal = d.name;
				}

				glimma.get.chart(srcChart).lowlightAll();
				glimma.get.chart(srcChart).softHighlightBar([firstDimVal, secondDimVal]);
			}

			function resetBarHighlights() {
				glimma.get.chart(srcChart).resetHighlightBar();
			}

			function withinMDSBound(dim, maxDim) {
				dim = Number(dim);
				var upperBound  = Math.min(maxDim, 8);

				return dim <= upperBound;
			}

			function drawMultiGroups(groupNames) {
				var row, ul, content;

				drawPills();
				bindPillActions(groupNames, ul);

				function drawPills() {
					d3.select("div.col-md-6:nth-child(2)")
						.append("h4")
						.style("text-align", "center")
						.classed("row", true)
						.text("MDS Colour Group");

					row = d3.select("div.col-md-6:nth-child(2)")
							.append("div")
							.style("text-align", "center")
							.classed("row", true);

					ul = row.append("ul")
							.attr("class", "nav nav-pills")
							.style("display", "inline-block");

					content = d3.select("div.col-md-6:nth-child(2)")
								.append("div")
								.style("text-align", "center")
								.classed("row", true);
				}

				function bindPillActions(groupNames, ul) {
					var ulSel;

					for (var j = 0; j < groupNames.length; j++) {
						ulSel = ul.append("li");

						if (j === 0) {
							ulSel.classed("active", true);
						}

						ulSel.append("a")
								.attr("data-toggle", "pill")
								.text(groupNames[j])
								.style("user-select", "none")
								.style("cursor", "pointer")
								.on("click", function (d) {
									var colgroup = this.innerHTML;
									glimma.get.chart(0).col(function(d) { return d[colgroup]; }).refresh();
								});
					}
				}
			}

			function getLinkageInfo(i, key) {
				output = glimma.storage.linkage[i][key];

				// convert from 1 to 0 indexing
				if (key === "from" || key === "to") {
					output -= 1;
				}

				return output;
			}
		}());
	}
};
