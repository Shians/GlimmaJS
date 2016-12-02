// Cycle through constructed plots
glimma.init.processCharts = function() {
	if (d3.select(".glimma-plot.available").node()) {
		for (var i = 0; i < glimma.storage.chartInfo.length; i++) {
			var chart = glimma.get.chart(i),
				chartInfo = glimma.get.chartInfo(i),
				chartData = glimma.get.chartData(i);

			chartData = chartData.map(addUID);

			var chartObj = {"chart": chart,
							"chartInfo": chartInfo,
							"chartData": chartData};


			// MD Plot initialisation
			if (chartInfo.flag === "mdplot") {
				processMD(chartObj);
			// Default initialisation
			} else {
				processDefault(chartObj);
			}

			// Hide plots if required
			if (chartInfo.hide) {
				chart.hide();
			}
		}
	}

	function addUID(d, i) {
		d._uid = i;
		return d;
	}

	function processDefault(chartObj) {
		var chart = chartObj.chart,
			chartInfo = chartObj.chartInfo,
			chartData = chartObj.chartData;

		if (chartInfo.disableClick) {
			chart.on("click", null);
		}

		if (chartInfo.disableHover) {
			chart.on("hover", null);
		}

		if (chartInfo.disableZoom) {
			chart.enableBrush(false);
		}

		d3.select(".glimma-plot.available")
			.datum(chartData)
			.call(chart);
	}

	function processMD(chartObj) {
		var colGetter = function (d) { return d.col; };

		chartObj.chart.col(colGetter)
					  .fixedCol(true);

		processDefault(chartObj);
	}
};

