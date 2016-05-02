// Cycle through constructed plots
glimma.init.processCharts = function() {
	if (d3.select(".glimma-plot.available").node()) {
		for (var i = 0; i < glimma.storage.chartInfo.length; i++) {
			var chartInfo = glimma.storage.chartInfo[i];

			glimma.storage.chartData[i] = glimma.storage.chartData[i].map(function (d, i) {
				d._uid = i;
				return d;
			});

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

	function processDefault(i) {
		d3.select(".glimma-plot.available")
					.datum(glimma.storage.chartData[i])
					.call(glimma.storage.charts[i]);

		if (chartInfo.disableClick) {
			chart.on("click", null);
		}

		if (chartInfo.disableHover) {
			chart.on("hover", null);
		}

		if (chartInfo.disableZoom) {
			chart.enableBrush(false);
		}
	}

	function processMD(i) {
		var temp = function (d) { return d.col; };
		glimma.storage.charts[i].col(temp)
								.fixedCol(true);

		processDefault(i);
	}
};

