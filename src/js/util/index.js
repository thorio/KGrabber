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

/**
 * wildcard-enabled string comparison
 */
exports.if = (str, rule) => {
	return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
};

/**
 * iterates over an array with supplied function
 */
exports.for = (array, func, { min = 0, max = array.length - 1 } = {}) => {
	for (let i = min; i <= max; i++) {
		func(i, array[i]);
	}
};

/** 
 * replaces characters that have special meaning in a batch file or are forbidden in directory names
 */
exports.makeBatSafe = (str) => {
	return str.replace(/[%^&<>|:\\/?*"]/g, "_");
};

/**
 * promisified setTimeout
 */
let wait = exports.wait = (time) =>
	new Promise((resolve) => {
		setTimeout(resolve, time);
	});

/**
 * postpones execution until event queue is cleared
 * Either pass a function or await this function
 */
exports.defer = async (func = () => {}) => {
	await wait(0);
	func();
};

/** 
 * returns parsed json or undefined if parse fails
 */
exports.tryParseJson = (str) => {
	try {
		return JSON.parse(str);
	} catch (e) {
		// return undefined
	}
};

exports.clone = (obj) =>
	$.extend(true, {}, obj);

exports.clear = (obj) =>
	Object.keys(obj).forEach(function(key) { delete obj[key]; });

exports.merge = (obj1, obj2) =>
	$.extend(true, obj1, obj2);

exports.last = (arr) =>
	arr[arr.length - 1];

/**
 * calls all functions passed
 * @param {Function[]} functions - Functions to call
 */
exports.call = (functions = []) => {
	for (let func of functions) {
		func();
	}
};
