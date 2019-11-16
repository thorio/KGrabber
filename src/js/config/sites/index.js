const Dictionary = require("../../types/Dictionary"),
	page = require("../../UI/page");

exports = module.exports = new Dictionary([
	require("./kissanime"),
	require("./kimcartoon"),
	require("./kissasian"),
	require("./kisstvshow"),
]);

exports.current = () =>
	exports.get(page.location.hostname);
