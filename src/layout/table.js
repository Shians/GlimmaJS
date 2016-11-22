//* REQUIRES DATATABLE.JS LIBRARY *//
/**
 * @param  {selection} selection d3 selection to add row to.
 * @return {selection} d3 selection of newly created row.
 **/
glimma.layout.addTable = function(selection) {
	var table = selection.append("table")
							.classed("cell-border", true)
							.classed("hover", true)
							.classed("stripe", true)
							.classed("available", true)
							.style("width", "100%");
	return table;
};