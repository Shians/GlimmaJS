// Cycle through constructed plots
glimma.init.initialise = function() {
	if (d3.select(".glimma-plot.available").node()) {
		for (var i = 0; i < glimma.storage.chartInfo.length; i++) {
			// if (glimma.storage.chartInfo[i].flag === "mdplot") {
				// var temp = function (d) {
				// 				if (d.PValue > 0.05) {
				// 					return "#858585";
				// 				} else if (d.PValue < 0.05) {
				// 					if (d.logFC < 0) {
				// 						return "#A8243E";
				// 					} else {
				// 						return "#5571A2";
				// 					}
				// 				}
				// 			};
				// glimma.storage.charts[i].col(temp)
				// 						.fixedCol(true);

				// d3.select(".glimma-plot.available")
				// 	.datum(glimma.storage.chartData[i])
				// 	.call(glimma.storage.charts[i]);
			// } else {
				d3.select(".glimma-plot.available")
					.datum(glimma.storage.chartData[i])
					.call(glimma.storage.charts[i]);
			// }
		}
	}
};

glimma.init.initialize = glimma.init.initialise;