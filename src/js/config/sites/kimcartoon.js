const { Server, Site, Dictionary, LinkTypes } = require("kgrabber-types"),
	uiFix = require("./patches/kimcartoon_UIFix");

let servers = new Dictionary([
	new Server("hx", {
		regex: /src="(\/\/playhydrax.com\/\?v=.*?)"/,
		captureGroup: 1,
		trimQuotes: false,
		name: "HX (hydrax)",
		linkType: LinkTypes.EMBED,
	}),

	new Server("fe", {
		regex: /"(https:\/\/www.luxubu.review\/v\/.*?)"/,
		captureGroup: 1,
		trimQuotes: false,
		name: "FE (luxubu.review)",
		linkType: LinkTypes.EMBED,
	}),

	new Server("beta", {
		regex: /"(https:\/\/redirector.googlevideo.com\/videoplayback\?.*?)"/,
		captureGroup: 1,
		trimQuotes: false,
		name: "Beta",
		linkType: LinkTypes.DIRECT,
	}),

	new Server("alpha", {
		regex: /"(https:\/\/redirector.googlevideo.com\/videoplayback\?.*?)"/,
		captureGroup: 1,
		trimQuotes: false,
		name: "Alpha (googleusercontent.com)",
		linkType: LinkTypes.DIRECT,
	}),
]);

module.exports = new Site("kimcartoon.to", {
	contentPath: "Cartoon",
	noCaptchaServer: "rapid",
	buttonColor: "#ecc835",
	buttonTextColor: "#000",
	servers,
	patches: uiFix,
});
