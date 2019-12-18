const Server = require("../../types/Server"),
	Site = require("../../types/Site"),
	Dictionary = require("../../types/Dictionary"),
	LinkTypes = require("../../types/LinkTypes");

let servers = new Dictionary([
		new Server("hydrax", {
		regex: /"https:\/\/replay.watch\/hydrax.html\??.*?#slug=.*?"/,
		name: "HydraX (no captcha)",
		linkType: LinkTypes.EMBED,
		customStep: "turboBegin",
	}),

		new Server("nova", {
		regex: /"https:\/\/www.novelplanet.me\/v\/.*?"/,
		name: "Nova",
		linkType: LinkTypes.EMBED,
		customStep: "modalBegin",
	}),

		new Server("beta2", {
		regex: /"https:\/\/lh3.googleusercontent.com\/.*?"/,
		name: "Beta2",
		linkType: LinkTypes.DIRECT,
	}),

		new Server("openload", {
		regex: /"https:\/\/openload.co\/embed\/.*?"/,
		name: "Openload",
		linkType: LinkTypes.EMBED,
	}),

		new Server("mp4upload", {
		regex: /"https:\/\/www.mp4upload.com\/embed-.*?"/,
		name: "Mp4Upload",
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
]);

module.exports = new Site("kissanime.ru", {
	contentPath: "Anime",
	noCaptchaServer: "hydrax",
	buttonColor: "#548602",
	buttonTextColor: "#fff",
	servers,
});
