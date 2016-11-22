// Cycle through constructed plots
glimma.init.processCharts = function() {
	if (d3.select(".glimma-plot.available").node()) {
		for (var i = 0; i < glimma.storage.chartInfo.length; i++) {
			var chartInfo = glimma.storage.chartInfo[i];

			glimma.storage.chartData[i] = glimma.storage.chartData[i].map(addUID);

			// MD Plot initialisation
			if (chartInfo.flag === "mdplot") {
				processMD(i);
			// Default initialisation
			} else {
				processDefault(i);
			}

			// Hide plots if required
			if (chartInfo.hide) {
				glimma.storage.charts[i].hide();
			}
		}
	}

	function addUID(d, i) {
		d._uid = i;
		return d;
	}

	function processDefault(i) {
		var chart = glimma.storage.charts[i],
			chartInfo = glimma.storage.chartInfo[i],
			chartData = glimma.storage.chartData[i];

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

	function processMD(i) {
		glimma.storage.charts[i].col(function (d) { return d.col; })
								.fixedCol(true);

		processDefault(i);
	}
};

