const Server = require("../../types/Server"),
	Site = require("../../types/Site"),
	Dictionary = require("../../types/Dictionary"),
	LinkTypes = require("../../types/LinkTypes"),
	uiFix = require("./patches/kissasian_UIFix");

let servers = new Dictionary([
		new Server("openload", {
		regex: /"https:\/\/openload.co\/embed\/.*?"/,
		name: "Openload",
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

		new Server("fe", {
		regex: /"https:\/\/www.gaobook.review\/v\/.*?"/,
		name: "FE (gaobook.review)",
		linkType: LinkTypes.EMBED,
	}),

		new Server("mp", {
		regex: /"https:\/\/www.mp4upload.com\/embed-.*?"/,
		name: "MP (mp4upload.com)",
		linkType: LinkTypes.EMBED,
	}),

		new Server("fb", {
		regex: /"https:\/\/video.xx.fbcdn.net\/v\/.*?"/,
		name: "FB (fbcdn.net)",
		linkType: LinkTypes.DIRECT,
	}),

		new Server("alpha", {
		regex: /"https:\/\/redirector.googlevideo.com\/videoplayback\?.*?"/,
		name: "Alpha",
		linkType: LinkTypes.DIRECT,
	}),
]);

module.exports = new Site("kissasian.sh", {
	contentPath: "Drama",
	noCaptchaServer: "rapid",
	buttonColor: "#F5B54B",
	buttonTextColor: "#000",
	servers,
	patches: [uiFix],
});
