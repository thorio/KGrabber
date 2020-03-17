const { Server, Site, Dictionary, LinkTypes } = require("kgrabber-types");

let servers = new Dictionary([
	new Server("xserver", {
		regex: /"https:\/\/redirector.googlevideo.com\/videoplayback\?.*?"/,
		name: "Xserver (googlevideo)",
		linkType: LinkTypes.EMBED,
		customStep: "modalBegin",
	}),

	new Server("hserver", {
		regex: /"https:\/\/playhydrax.com\/\?v=.*?"/,
		name: "Hserver (hydrax)",
		linkType: LinkTypes.DIRECT,
		customStep: "modalBegin",
	}),

	new Server("oserver", {
		regex: /"https:\/\/lh3.googleusercontent.com\/.*?"/,
		name: "Oserver (streamx)",
		linkType: LinkTypes.DIRECT,
		customStep: "modalBegin",
	}),
]);

module.exports = new Site("kissanime.nz", {
	contentPath: "Anime",
	noCaptchaServer: "xserver",
	buttonColor: "#548602",
	buttonTextColor: "#fff",
	servers,
});
