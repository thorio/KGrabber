const Server = require("../../types/Server"),
	Dictionary = require("../../types/Dictionary"),
	LinkTypes = require("../../types/LinkTypes");

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

	new Server("fb", {
		regex: /"https:\/\/video.xx.fbcdn.net\/v\/.*?"/,
		name: "FB (fbcdn.net)",
		linkType: LinkTypes.DIRECT,
	}),

	new Server("gp", {
		regex: /"https:\/\/redirector.googlevideo.com\/videoplayback\?.*?"/,
		name: "GP (googleusercontent.com)",
		linkType: LinkTypes.DIRECT,
	}),

	new Server("fe", {
		regex: /"https:\/\/www.rubicstreaming.com\/v\/.*?"/,
		name: "FE (rubicstreaming.com)",
		linkType: LinkTypes.EMBED,
	}),
]);

module.exports = {
	contentPath: "/Show/*",
	noCaptchaServer: "rapid",
	buttonColor: "#F5B54B",
	buttonTextColor: "#000",
	servers,
};
