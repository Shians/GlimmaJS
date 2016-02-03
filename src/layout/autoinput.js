/**
 * Create an input button with 
 * @return {Object}
 */
glimma.layout.addAutoInput = function(selection, options) {
	var row = glimma.layout.bsAddRow(selection);
	// var col = glimma.layout.bsAddCol(row, 12);

	function addButton(selection, options) {
		var input = selection.append("input");
		var button = selection.append("button");

		button.html("Search");

		$(input.node()).keyup(function (event) {
			if (event.keyCode == 13) {
			    $(button.node()).click();
			}
		});

		button.actionCount = 0;
		button.addAction = function(action) {
			var wrapper = function () {
				action(input.node().value);
			};

			this.actionCount += 1;
			this.on("click.chart" + this.actionCount, wrapper);
			return button;
		};

		button.updateOptions = function(options) {
			$(input.node()).autocomplete({
				source: options,
				minLength: 2,
				delay: 50
			});
			return button;
		};

		button.updateOptions(options);

		return button;
	}

	return addButton(row, options);
};