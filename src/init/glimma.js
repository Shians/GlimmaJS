window.glimma = {
	storage: {
		chartData: [],
		chartInfo: [],
		charts: [],
		linkage: [],
		input: [],
		tables: []
	},
	debug: {
		charts: [],
		tables: [],
		log: false
	},
	log: function(x) {
		if (glimma.debug.log) {
			console.log(x);
		}
	}
};
