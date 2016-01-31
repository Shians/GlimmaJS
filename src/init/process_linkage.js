glimma.init.processLinkages = function () {
	for (var i=0; i<glimma.storage.linkage.length; i++) {
		(function () {
			var from = glimma.storage.linkage[i].from - 1;
			var to = glimma.storage.linkage[i].to - 1;
			
			if (glimma.storage.linkage[i].flag === "mds") {
				glimma.charts[from].on("click", 
					function (d) {
						if (d.name < 8) {
							(function () {
								var tmpstr1 = "dim" + d.name;
								var tmpstr2 = "Dimension " + d.name;
								var tmpstr3 = "dim" + (d.name + 1);
								var tmpstr4 = "Dimension " + (d.name + 1);
								glimma.charts[to]
									.x(function (d) { return d[tmpstr1]; })
									.xlab(tmpstr2)
									.y(function (d) { return d[tmpstr3]; })
									.ylab(tmpstr4)
									.tooltip(["labels", tmpstr1, tmpstr3]);
							}());
							glimma.charts[to].refresh();	
						}
					}
				);
			} else {
				var src = glimma.storage.linkage[i].src;
				var dest = glimma.storage.linkage[i].dest;	

				if (dest == "hover" && dest == "hover") {
					glimma.charts[from].on(src + ".chart" + from, function (d) {
						glimma.charts[to][dest](d);
					});
					glimma.charts[from].on("leave" + ".chart" + from, function (d) {
						glimma.charts[to].leave(d);
					});
				} else {
					glimma.charts[from].on(src + ".chart" + from, function (d) {
						glimma.charts[to][dest](d);
					});	
				}
			}
		}());
	}	
};
