glimma.init.transformData = function() {
	for (var i = 0; i < glimma.storage.chartData.length; i++) {
		glimma.storage.chartData[i] = glimma.transform.toRowMajor(glimma.storage.chartData[i]);
	}
}
