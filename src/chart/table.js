/**
 * Returns a function
 * @return {function} returned function can be called on a d3 selection to create table
 */
glimma.chart.table = function() {
	var tableData = {
					"deferRender": true,
					"scrollY": 400,
					"lengthChange": false,
					"scrollCollapse": true,
			        "scroller": true,
			        "select": {
			        	"style": "single",
			        	"info": false
			        }
				},
		dispatcher = d3.dispatch("click");

	var tab;

	function table(selection) {
		tab = $(selection.node()).DataTable(tableData);

		tab.on("click", function (e, dt, type, indexes) {
			dispatcher.click(tab.rows({selected: true}).data().pluck("_uid").toArray()[0]);
		});

		selection.classed("available", false);

		d3.select("div.dataTables_paginate").remove();
		return tab;
	}

	// No internal actions required yet, highlighting handled by select addon for DataTables
	// dispatcher.on("click", function (d) { table.click(d); });

	table.data = function(_) {
		if (!arguments.length) return tableData.data;
		tableData.data = _;
		return table;
	};

	table.columns = function(_) {
		if (!arguments.length) return tableData.columns.map(function (d) { return d.title; });

		var mapFun = function(d) {
			if (d.search("\\." !== -1)) {
				return {data: d.replace(/[.]/g, "\\."), title: d};
			} else {
				return {data: d, title: d};
			}
		};

		tableData.columns = _.map(mapFun);
		return table;
	};

	table.click = function() {
		dispatcher.click(tab.rows({selected: true}).data().pluck("_uid").toArray()[0]);
	};

	table.highlightById = function(d) {
		var uid = d._uid;

		table.selectById(uid);
		table.scrollTo(uid);
	};

	table.scrollTo = function(uid) {
		tab.row(uid).scrollTo();
	};

	table.selectById = function(uid) {
		tab.row(uid).select();
	};

	d3.rebind(table, dispatcher, "on");

	return table;
};
