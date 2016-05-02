// Function to process the inputs at initialisation

glimma.init.processTables = function () {
	for (var i = 0; i < glimma.storage.tables.length; i++) {
		(function() {
			var table = glimma.storage.tables[i];
			table(d3.select("table.available"));
		}());
	}
};