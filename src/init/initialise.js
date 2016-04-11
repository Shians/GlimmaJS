// Cycle through constructed plots
glimma.init.initialise = function() {
	if (d3.select(".glimma-plot.available").node()) {
		for (var i = 0; i < glimma.storage.chartInfo.length; i++) {
			var chartInfo = glimma.storage.chartInfo[i];

			// MD Plot initialisation
			if (chartInfo.flag === "mdplot") {
				var temp = function (d) { return d.col; };
				glimma.storage.charts[i].col(temp)
										.fixedCol(true);

				glimma.storage.chartData[i] = glimma.storage.chartData[i].map(function (d, i) {
					d._uid = i;
					return d;
				});

				d3.select(".glimma-plot.available")
					.datum(glimma.storage.chartData[i])
					.call(glimma.storage.charts[i]);
			// Default initialisation
			} else {
				d3.select(".glimma-plot.available")
					.datum(glimma.storage.chartData[i])
					.call(glimma.storage.charts[i]);
			}

			// Hide plots if required
			if (chartInfo.hide === "TRUE") {
				glimma.storage.charts[i].hide();
			}
		}
	}
};

glimma.init.initialize = glimma.init.initialise;