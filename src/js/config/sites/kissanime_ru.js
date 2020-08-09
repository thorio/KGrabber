const { Server, Site, Dictionary, LinkTypes } = require("kgrabber-types");

let servers = new Dictionary([
	new Server("hydrax", {
		regex: /"(https:\/\/playhydrax.com\/\?v=.*?)"/,
		captureGroup: 1,
		trimQuotes: false,
		name: "HydraX (no captcha)",
		linkType: LinkTypes.EMBED,
		customStep: "modalBegin",
	}),

	new Server("nova", {
		regex: /"(https:\/\/(?:www).feurl.com\/v\/.*?)"/,
		captureGroup: 1,
		trimQuotes: false,
		name: "Nova",
		linkType: LinkTypes.EMBED,
		customStep: "modalBegin",
	}),

	new Server("beta", {
		regex: /<select id="slcQualix"><option value="([^"]+)" ?(selected)?>/,
		captureGroup: 1,
		trimQuotes: false,
		name: "Beta",
		linkType: LinkTypes.OVELWRAP,
		customStep: "modalBegin",
	}),

	new Server("beta360p", {
		regex: /<select id="slcQualix"><option value="([^"]+)" ?(selected)?>/,
		captureGroup: 1,
		trimQuotes: false,
		name: "Beta360P",
		linkType: LinkTypes.OVELWRAP,
		customStep: "modalBegin",
	}),

	new Server("beta5", {
		regex: /<select id="slcQualix"><option value="([^"]+)" ?(selected)?>/,
		captureGroup: 1,
		trimQuotes: false,
		name: "Beta5",
		linkType: LinkTypes.OVELWRAP,
		customStep: "modalBegin",
	}),

	new Server("mp4upload", {
		regex: /"(https:\/\/www.mp4upload.com\/embed-.*?)"/,
		captureGroup: 1,
		trimQuotes: false,
		name: "Mp4Upload",
		linkType: LinkTypes.EMBED,
		customStep: "modalBegin",
	}),
]);

module.exports = new Site("kissanime.ru", {
	contentPath: "Anime",
	noCaptchaServer: "hydrax",
	buttonColor: "#548602",
	buttonTextColor: "#fff",
	servers,
});
