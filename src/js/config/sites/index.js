const servers = require("./servers"),
	patches = require("./patches");

exports = module.exports = {
	"kissanime.ru": {
		contentPath: "/Anime/*",
		noCaptchaServer: "hydrax",
		buttonColor: "#548602",
		buttonTextColor: "#fff",
		servers: servers.kissanime
	},
	"kimcartoon.to": {
		contentPath: "/Cartoon/*",
		noCaptchaServer: "rapid",
		buttonColor: "#ecc835",
		buttonTextColor: "#000",
		optsPosition: 1, // TODO move to patch
		servers: servers.kimcartoon,
		patches: [patches.kimcartoon_UIFix]
	},
	"kissasian.sh": {
		contentPath: "/Drama/*",
		noCaptchaServer: "rapid",
		buttonColor: "#F5B54B",
		buttonTextColor: "#000",
		servers: servers.kissasian,
		patches: [patches.kissasian_UIFix]
	},
	"kisstvshow.to": {
		contentPath: "/Show/*",
		noCaptchaServer: "rapid",
		buttonColor: "#F5B54B",
		buttonTextColor: "#000",
		servers: servers.kisstvshow
	},
};

exports.current = () =>
	exports[location.hostname];
