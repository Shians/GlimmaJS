// Function to process the inputs at initialisation

glimma.init.processInputs = function () {
	for (var i = 0; i < glimma.storage.input.length; i++) {
		(function() {
			var buttonInfo = glimma.storage.input[i],
				chart = glimma.storage.charts[i],
				container = glimma.storage.charts[i].container,
				options = glimma.storage.chartData[i].map(function (d) { return d[buttonInfo.idval]; }),
				button = glimma.layout.addAutoInput(container, options);

				button.addAction(function (d) {
					chart[buttonInfo.action](d);
				});
		}());
	}
};