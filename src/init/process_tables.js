// Function to process the inputs at initialisation

glimma.init.processTables = function () {
	for (var i = 0; i < glimma.storage.tables.length; i++) {
		(function() {
			// D3 selection, click event is bound to this.
			var table = glimma.storage.tables[i];
			var sel = d3.select("table.available");
			// Datatables object
			var tab = table(sel);
			
			sel.selectAll("tbody>tr").classed("clickable", true);
			d3.select(sel.node().parentNode).select("input")
				.on("keyup.clicker", function(d) { 
					if (d3.event.keyCode === 13) {
						var rowSel  = tab.row(0, {page: "current"}).select();
						if (rowSel.any) {
							table.click();
						}
					}
				});
		}());
	}
};