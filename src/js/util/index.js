exports.log = require("./log");
exports.ajax = require("./ajax");

exports.findLink = (html, regexString) => {
	let re = new RegExp(regexString);
	let result = html.match(re);
	if (result && result.length > 0) {
		return result[0].split('"')[1];
	}
	return "";
};

//wildcard-enabled string comparison
exports.if = (str, rule) => {
	return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
};

//iterates over an array with supplied function
//either (array, min, max, func)
//or     (array, func)
exports.for = (array, min, max, func) => {
	if (typeof min == "function") {
		func = min;
		max = array.length - 1;
	}
	min = Math.max(0, min) || 0;
	max = Math.min(array.length - 1, max);
	for (let i = min; i <= max; i++) {
		func(i, array[i]);
	}
};

//removes characters that have special meaning in a batch file or are forbidden in directory names
exports.makeBatSafe = (str) => {
	return str.replace(/[%^&<>|:\\/?*"]/g, "_");
};

exports.timeout = (time) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};

//returns parsed json or undefined if parse fails
exports.tryParseJson = (str) => {
	try {
		return JSON.parse(str);
	} catch (e) {
		// return undefined
	}
};
