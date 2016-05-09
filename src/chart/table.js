/**
 * Returns a function
 * @return {function} returned function can be called on a d3 selection to create table
 */
glimma.chart.table = function() {
	var tableData = { 
					table: "display",
					select: { style: "single" },
					pagingType: "full_numbers"
				},
		dispatcher = d3.dispatch("click");

	function table(selection) {
		var tab = $(selection.node()).DataTable(tableData);
		
		tab.on("click", function (e, dt, type, indexes) {
			dispatcher.click(tab.rows({selected: true}).data().pluck("_uid").toArray()[0]);
		});

		selection.classed("available", false);
	}

	// No internal actions required yet, highlighting handled by select addon for DataTables
	// dispatcher.on("click", function (d) { table.click(d); });

	table.data = function(_) {
		if (!arguments.length) return tableData.data;
		tableData.data = _;
		return table;
	};

	table.columns = function(_) {
		if (!arguments.length) return tableData.columns.map(function (d) { return d.title });

		var mapFun = function(d) {
			if (d.search("\\." !== -1)) {
				return {data: d.replace(".", "\\."), title: d};
			} else {
				return {data: d, title: d};
			}
		};

		tableData.columns = _.map(mapFun);
		return table;
	};

	// No internal actions required yet, highlighting handled by select addon for DataTables
	// table.click = function(id) {
	// 	console.log(id);
	// };
	
	d3.rebind(table, dispatcher, "on");

	return table;
}
