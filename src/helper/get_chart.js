glimma.get = {};

glimma.get.chart = function(id) {
	var chart = undefined;

	if (id >= 0 || id < glimma.storage.charts.length) {
		chart = glimma.storage.charts[id];
	} else {
		console.error("Index out of range.")
	}

	return chart;
}

glimma.get.chartInfo = function(id) {
	var chartInfo = undefined;

	if (id >= 0 || id < glimma.storage.chartInfo.length) {
		chartInfo = glimma.storage.chartInfo[id];
	} else {
		console.error("Index out of range.")
	}

	return chartInfo;
}

glimma.get.chartData = function(id) {
	var chartData = undefined;

	if (id >= 0 || id < glimma.storage.chartData.length) {
		chartData = glimma.storage.chartData[id];
	} else {
		console.error("Index out of range.")
	}

	return chartData;
}

glimma.get.table = function(id) {
	var table = undefined;

	if (id >= 0 || id < glimma.storage.tables.length) {
		table = glimma.storage.tables[id];
	} else {
		console.error("Index out of range.")
	}

	return table;
}