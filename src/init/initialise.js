// Cycle through constructed plots
glimma.init.initialise = function() {
	if (d3.select(".glimma-plot.available").node()) {
		for (var i=0; i<glimma.storage.chartInfo.length; i++) {
			d3.select(".glimma-plot.available").datum(glimma.storage.chartData[i]).call(glimma.storage.charts[i]);
		}
	}
};

glimma.init.initialize = glimma.init.initialise;