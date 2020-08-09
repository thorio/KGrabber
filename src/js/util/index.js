exports.log = require("./log");
exports.ajax = require("./ajax");
exports.kissCrypto = require("./kissCrypto");

/**
 * Iterates over an array with supplied function
 * @template T Array type
 * @param {T[]} array Array to iterate over
 * @param {function(Number, T):void} func Function that gets called with an object and its index
 * @param {Object} [obj]
 * @param {Number} [obj.min] Array index to start from (inclusive)
 * @param {Number} [obj.max] Array index to end at (inclusive)
 */
exports.for = (array, func, { min = 0, max = array.length - 1 } = {}) => {
	for (let i = min; i <= max; i++) {
		func(i, array[i]);
	}
};

/**
 * Replaces
 * - illegal characters in windows/unix filenames
 * - special characters in batch files
 * @param {String} str
 * @returns {String}
 */
exports.replaceSpecialCharacters = (str) => {
	return str.replace(/[%^&<>|:\\/?*"]/g, "_");
};

/**
 * Replaces tags in the format of `{key}` with the corresponding value.
 * Unresolved keys are ignored.
 * @param {string} str
 * @param {Object<string, string>} values
 */
exports.replaceTags = (str, values) => {
	return str.replace(/{(.*?)}/g, (match, key) => {
		let value = values[key];
		return value === undefined ? match : value;
	});
};

/**
 * Promisified setTimeout
 * @param {number} time Wait time in milliseconds
 * @returns {Promise<void>} Promise resolves after timeout
 */
let wait = exports.wait = (time) =>
	new Promise((resolve) => {
		setTimeout(resolve, time);
	});

/**
 * Postpones execution until event queue is cleared
 * Either pass a function or await this function
 * @param {Function} [callback]
 * @returns {Promise<void>}
 */
exports.defer = async (callback = () => {}) => {
	await wait(0);
	callback();
};

/**
 * Clones object properties
 * @param {Object} obj
 * @returns {Object}
 */
exports.clone = (obj) =>
	$.extend(true, {}, obj);

/**
 * Strips iterable properties from an object
 * Used to clear an object without breaking references to it
 * @param {Object} obj
 * @returns {Object} Empty object
 */
exports.clear = (obj) =>
	Object.keys(obj).forEach(function(key) { delete obj[key]; });

/**
 * Merges two objects by copying properties of the second onto the first
 * @param {Object} obj1 This object is mutated in the process
 * @param {Object} obj2
 * @returns {Object} obj1 with added properties of obj2
 */
exports.merge = (obj1, obj2) =>
	$.extend(true, obj1, obj2);

/**
 * Returns the last element of an array
 * @param {T[]} arr
 * @returns {T} Last element
 * @template T Array type
 */
exports.last = (arr) =>
	arr[arr.length - 1];

/**
 * form/urlencodes the given object
 * @param {Object} obj
 * @returns {String}
 */
exports.urlEncode = (obj) => {
	let str = "";
	for (let i in obj) {
		str += `${encodeURIComponent(i)}=${encodeURIComponent(obj[i])}&`;
	}
	return str.slice(0, -1); // remove trailing '&'
};
