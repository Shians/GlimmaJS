glimma.chart.mdsChart = function() {
	var dimsChart = glimma.chart.scatterChart(),
		eigenChart = glimma.chart.barChart;

	dimsChart._swapDim = function (dim1, dim2) {
		chart.x(function (d) { return d[["dim" + dim1]]; });
    	chart.y(function (d) { return d[["dim" + dim2]]; });

    	chart.xlab("Dimension " + dim1);
    	chart.ylab("Dimension " + dim2);
    	chart.update();
	};

	var container,
		front,
		data;

	function chart(selection) {
		var dispatcher = d3.dispatch("hover", "leave", "click");
	}

	return chart;
};