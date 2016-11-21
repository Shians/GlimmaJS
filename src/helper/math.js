glimma.math = {};

glimma.math.round = function(n, digits) {
	digits = typeof digits !== "undefined" ? digits : 0;

	n = +n;
	digits = +digits;

	if (isNaN(n) || !(typeof digits === "number" && digits % 1 === 0)) {
		return NaN;
	}

	return Math.round(n * Math.pow(10, digits)) / Math.pow(10, digits);
};

glimma.math.signif = function(n, digits) {
	digits = typeof digits !== "undefined" ? digits : 0;

	n = +n;
	digits = +digits;

	if (isNaN(n) || !(typeof digits === "number" && digits % 1 === 0) || digits <= 0) {
		return NaN;
	}

	return +n.toPrecision(digits);
};