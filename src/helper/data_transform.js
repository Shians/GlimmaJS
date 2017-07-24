glimma.transform = {};

glimma.transform.toRowMajor = function(obj) {
	var col_names = Object.keys(obj);
	var n_row = obj[col_names[0]].length;

	var row_range = _.range(n_row);
	var output = _.map(row_range, function(i) {
			var output = {};
			for (var col_index = 0; col_index < col_names.length; col_index++) {
				column = col_names[col_index];
				output[column] = obj[column][i];
			}
			return output;
		}
	);
	return output
}