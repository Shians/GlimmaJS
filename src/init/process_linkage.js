glimma.init.processLinkages = function () {
	for (var i=0; i<glimma.linkage.length; i++) {
		(function () {
			var from = glimma.linkage[i].from - 1;
			var to = glimma.linkage[i].to - 1;
			
			if (glimma.linkage[i].flag === "mds") {
				glimma.charts[from].on("click", 
					function (d) {
						if (d.name < 8) {
							(function () {
								var tmpstr1 = "dim" + d.name;
								var tmpstr2 = "dim" + (d.name + 1);
								glimma.charts[to]
									.x(function (d) { return d[tmpstr]; })
									.xlab(tmpstr)
									.y(function (d) { return d[tmpstr]; })
									.ylab(tmpstr);
							}());
							glimma.charts[to].refresh();	
						}
					}
				);
			} else {
				var src = glimma.linkage[i].src;
				var dest = glimma.linkage[i].dest;	

				glimma.charts[from].on(src + ".chart" + from, function (d) {
					glimma.charts[to][dest](d);
				});	
			}
		}());
	}	
};
