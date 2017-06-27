glimma.transform = {};

glimma.transform.toD3Form = function(obj) {
	let col_names = Object.keys(obj);
	let n_row = obj[col_names[0]].length;

	return (_.map(_.range(n_row), function(i) {
		let output = {};
		for (col of col_names) {
			output[col] = obj[col][i];
		}
		return output;
	}));
}