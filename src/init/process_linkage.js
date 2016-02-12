// Function to process the action linkages between charts

glimma.init.processLinkages = function () {
	for (var i = 0; i < glimma.storage.linkage.length; i++) {
		// Closure to retain the indices
		(function () { 
			var from = glimma.storage.linkage[i].from - 1;
			var to = glimma.storage.linkage[i].to - 1;

			var flag = glimma.storage.linkage[i].flag;
			
			// Special mds linkage
			if (flag === "mds") { 
				glimma.storage.charts[from].on("click", 
					function (d) {
						if (d.name < 8) {
							(function () {
								var tmpstr1 = "dim" + d.name;
								var tmpstr2 = "Dimension " + d.name;
								var tmpstr3 = "dim" + (d.name + 1);
								var tmpstr4 = "Dimension " + (d.name + 1);
								glimma.storage.charts[to]
									.x(function (d) { return d[tmpstr1]; })
									.xlab(tmpstr2)
									.y(function (d) { return d[tmpstr3]; })
									.ylab(tmpstr4)
									.tooltip(["labels", tmpstr1, tmpstr3]);
							}());
							glimma.storage.charts[to].refresh();	
						}
					}
				);
			} else if (flag === "byKey") { // TODO: Alter tooltip on change.
				var src = glimma.storage.linkage[i].src;
				var dest = glimma.storage.linkage[i].dest;

				var key = glimma.storage.linkage[i].info;

				if (dest === "xChange") {
					glimma.storage.charts[from].on(src + ".chart" + from, function (d) {
						var updateKey = (typeof d[key] === "number") ? "X" + String(d[key]) : d[key];
						glimma.storage.charts[to].x(function (d) { return d[updateKey]; }).title(String(d[key]));
						glimma.storage.charts[to].refresh().show();
					});
				} else if (dest === "yChange") {
					glimma.storage.charts[from].on(src + ".chart" + from, function (d) {
						var updateKey = (typeof d[key] === "number") ? "X" + String(d[key]) : d[key];
						glimma.storage.charts[to].y(function (d) { return d[updateKey]; }).title(String(d[key]));
						glimma.storage.charts[to].refresh().show();
					});
				}

			// Default linkage
			} else {
				var src = glimma.storage.linkage[i].src;
				var dest = glimma.storage.linkage[i].dest;

				if (dest == "hover" && dest == "hover") {
					glimma.storage.charts[from].on(src + ".chart" + from, function (d) {
						glimma.storage.charts[to][dest](d);
					});
					glimma.storage.charts[from].on("leave" + ".chart" + from, function (d) {
						glimma.storage.charts[to].leave(d);
					});
				} else {
					glimma.storage.charts[from].on(src + ".chart" + from, function (d) {
						glimma.storage.charts[to][dest](d);
					});	
				}
			}
		}());
	}	
};
