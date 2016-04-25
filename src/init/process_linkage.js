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
						if (d.name < glimma.storage.chartInfo[from].info.dims) {
							(function () {
								var tmpstr1 = "dim" + d.name;
								var tmpstr2 = "Dimension " + d.name;
								var tmpstr3 = "dim" + (d.name + 1);
								var tmpstr4 = "Dimension " + (d.name + 1);

								var old = glimma.storage.charts[to].tooltip().slice(0, -2);

								glimma.storage.charts[to]
									.x(function (d) { return d[tmpstr1]; })
									.xlab(tmpstr2)
									.y(function (d) { return d[tmpstr3]; })
									.ylab(tmpstr4)
									.tooltip(old.concat([tmpstr1, tmpstr3]));
							}());
							glimma.storage.charts[to].refresh();
						}
					}
				);
			} else if (flag === "byKey") {
				var src = glimma.storage.linkage[i].src;
				var dest = glimma.storage.linkage[i].dest;

				var key = glimma.storage.linkage[i].info;

				if (dest === "xChange") {
					if (src === "click") {
						glimma.storage.charts[from].on(src + ".chart" + from, function (d) {
							var updateKey = (/^[0-9].*$/.test(d[key])) ? "X" + String(d[key]) : d[key]; // Append X if starts with number

							glimma.storage.charts[to].x(function (d) { return d[updateKey]; })
														.title(String(d[key]))
														.tooltip(["Sample", updateKey])
														.refresh()
														.show();
						});
					} else {
						glimma.storage.charts[from].on(src + ".chart" + from, function (d) {
							if (!glimma.storage.charts[from].holdTooltip()) {
								var updateKey = (/^[0-9].*$/.test(d[key])) ? "X" + String(d[key]) : d[key]; // Append X if starts with number

								glimma.storage.charts[to].x(function (d) { return d[updateKey]; })
															.title(String(d[key]))
															.tooltip(["Sample", updateKey])
															.refresh()
															.show();
							}
						});
					}
				} else if (dest === "yChange") {
					if (src === "click") {
						glimma.storage.charts[from].on(src + ".chart" + from, function (d) {
							var updateKey = (/^[0-9].*$/.test(d[key])) ? "X" + String(d[key]) : d[key]; // Append X if starts with number

							glimma.storage.charts[to].y(function (d) { return d[updateKey]; })
														.title(String(d[key]))
														.tooltip(["Sample", updateKey])
														.refresh()
														.show();
						});
					} else {
						glimma.storage.charts[from].on(src + ".chart" + from, function (d) {
							if (!glimma.storage.charts[from].holdTooltip()) {
								var updateKey = (/^[0-9].*$/.test(d[key])) ? "X" + String(d[key]) : d[key]; // Append X if starts with number

								glimma.storage.charts[to].y(function (d) { return d[updateKey]; })
															.title(String(d[key]))
															.tooltip(["Sample", updateKey])
															.refresh()
															.show();
							}
						});
					}
				}
			// Table linkage
			} else if (flag === "tablink") {
				var src = glimma.storage.linkage[i].src;
				var dest = glimma.storage.linkage[i].dest;

				glimma.storage.tables[from].on(src + ".chart" + from, function (d) {
					glimma.storage.charts[to][dest](d);
				});
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
