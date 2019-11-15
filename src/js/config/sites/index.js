const page = require("../../UI/page");

exports = module.exports = {
	"kissanime.ru": require("./kissanime"),
	"kimcartoon.to": require("./kimcartoon"),
	"kissasian.sh": require("./kissasian"),
	"kisstvshow.to": require("./kisstvshow"),
};

exports.current = () =>
	exports[page.location.hostname];
