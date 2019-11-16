const Server = require("../../types/Server"),
	Site = require("../../types/Site"),
	Dictionary = require("../../types/Dictionary"),
	LinkTypes = require("../../types/LinkTypes"),
	uiFix = require("./patches/kimcartoon_UIFix");

let servers = new Dictionary([
		new Server("openload", {
		regex: /"https:\/\/openload.co\/embed\/.*?"/,
		name: "Openload",
		linkType: LinkTypes.EMBED,
	}),

		new Server("streamango", {
		regex: /"https:\/\/streamango.com\/embed\/.*?"/,
		name: "Streamango",
		linkType: LinkTypes.EMBED,
	}),

		new Server("beta", {
		regex: /"https:\/\/redirector.googlevideo.com\/videoplayback\?.*?"/,
		name: "Beta",
		linkType: LinkTypes.DIRECT,
	}),

		new Server("rapid", {
		regex: /"https:\/\/w*?.*?rapidvid.to\/e\/.*?"/,
		name: "RapidVideo",
		linkType: LinkTypes.EMBED,
	}),

		new Server("fs", {
		regex: /"https:\/\/video.xx.fbcdn.net\/v\/.*?"/,
		name: "FS (fbcdn.net)",
		linkType: LinkTypes.DIRECT,
	}),

		new Server("gp", {
		regex: /"https:\/\/redirector.googlevideo.com\/videoplayback\?.*?"/,
		name: "GP (googleusercontent.com)",
		linkType: LinkTypes.DIRECT,
	}),

		new Server("fe", {
		regex: /"https:\/\/www.luxubu.review\/v\/.*?"/,
		name: "FE (luxubu.review)",
		linkType: LinkTypes.EMBED,
	}),
]);

module.exports = new Site("kimcartoon.to", {
	contentPath: "Cartoon",
	noCaptchaServer: "rapid",
	buttonColor: "#ecc835",
	buttonTextColor: "#000",
	servers,
	patches: [uiFix],
});
