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
						if (d.name < Math.min(8, glimma.storage.chartInfo[from].info.dims)) {
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

				var gNames = glimma.storage.chartInfo[0].info.groupsNames;

				if (typeof gNames === "object") {
					// Direct selection only because we know this is an MDS plot
					d3.select("div.col-md-6:nth-child(2)")
									.append("h4")
									.style("text-align", "center")
									.classed("row", true)
									.text("MDS Colour Group");

					var row = d3.select("div.col-md-6:nth-child(2)")
									.append("div")
									.style("text-align", "center")
									.classed("row", true);

					var ul = row.append("ul")
								.attr("class", "nav nav-pills")
								.style("display", "inline-block");

					var content = d3.select("div.col-md-6:nth-child(2)")
									.append("div")
									.style("text-align", "center")
									.classed("row", true);

					// Only first pill is active
					ul.append("li")
							.attr("class", "active")
							.append("a")
							.attr("data-toggle", "pill")
							.text(gNames[0])
							.style("cursor", "pointer")
							.on("click", function (d) {
								var colgroup = this.innerHTML;
								glimma.storage.charts[0].col(function(d) { return d[colgroup]; }).refresh();
							});

					for (var j = 1; j < gNames.length; j++) {
						ul.append("li")
							.append("a")
							.attr("data-toggle", "pill")
							.text(gNames[j])
							.style("cursor", "pointer")
							.on("click", function (d) {
								var colgroup = this.innerHTML;
								glimma.storage.charts[0].col(function(d) { return d[colgroup]; }).refresh();
							});
					}
				}
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
