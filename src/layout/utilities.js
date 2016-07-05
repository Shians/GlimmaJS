//* REQUIRES BOOTSTRAP.JS LIBRARY *//
/**
 * @param  {selection} selection d3 selection to add row to.
 * @return {selection} d3 selection of newly created row.
 */
glimma.layout.bsAddRow = function(selection) {
	var row = selection.append("div").attr("class", "row");
	return row;
};

/**
 * @param  {selection} selection d3 selection to add column to.
 * @param  {Number} size the size of the column.
 * @param  {String} type the type of the column (default: "md").
 * @return {selection}
 */
glimma.layout.bsAddCol = function(selection, size, type) {
	if (typeof type === "undefined") {
		var type = "md";
	}
	var col = selection.append("div").attr("class", "col-" + type + "-" + size);
	return col;
};

/**
 * Function to add an empty p element to a selection with the classes required for glimma plots to find.
 * @param {selection} selection selection to add a plottable window to.
 * @return {selection} selection of the created window.
 */
glimma.layout.addPlottableWindow = function(selection) {
	var p = selection.append("p").classed("glimma-plot", true).classed("available", true);
	return p;
};

/**
 * @param  {selection}
 * @param  {Array}
 * @param  {String}
 * @return {[type]}
 */
glimma.layout.setupRow = function(selection, sizes, type) {
	if (typeof type === "undefined") {
		var type = "md";
	}
	var arrSum = function (array) {
		return array.reduce(function (a, b) { return a + b; });
	};

	if (arrSum(sizes) <= 12 && arrSum(sizes) > 0) {
		var row = glimma.layout.bsAddRow(selection);
		for (var i = 0; i < sizes.length; i++) {
			var col = glimma.layout.bsAddCol(row, sizes[i], type);
			glimma.layout.addPlottableWindow(col);
		}
	}

	return selection;
};

glimma.layout.setupGrid = function(selection, type, dim) {
	var rows = +dim[0],
		cols = +dim[1],
		size = Math.floor(12 / cols),
		sizes = [];

	if (cols < 1) {
		return null;
	}

	for (var i = 0; i < cols; i++) {
		sizes.push(size);
	}

	for (var i = 0; i < rows; i++) {
		glimma.layout.setupRow(selection, sizes, type);
	}
};

glimma.rangeSpan = function(interval, step) {
	if (step != 0) {
		var lower = step * Math.ceil(interval[0]/step),
			upper = step * Math.floor(interval[1]/step);

		output = [];

		var nextval = lower;
		while (nextval <= upper) {
			output.push(nextval);
			nextval += step;
		}

		return output
	}
	return -1
};