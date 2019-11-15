// TODO remove dis

// const Server = require("../../types/Server"),
// 	ServerDictionary = require("../../types/ServerDictionary"),
// 	LinkTypes = require("../../types/LinkTypes");

// exports.kissanime = new ServerDictionary([
// 	new Server("hydrax", {
// 		regex: /"https:\/\/replay.watch\/hydrax.html\??.*?#slug=.*?"/,
// 		name: "HydraX (no captcha)",
// 		linkType: LinkTypes.EMBED,
// 		customStep: "turboBegin",
// 	}),

// 	new Server("nova", {
// 		regex: /"https:\/\/www.novelplanet.me\/v\/.*?"/,
// 		name: "Nova",
// 		linkType: LinkTypes.EMBED,
// 	}),

// 	new Server("beta2", {
// 		regex: /"https:\/\/lh3.googleusercontent.com\/.*?"/,
// 		name: "Beta2",
// 		linkType: LinkTypes.DIRECT,
// 	}),

// 	new Server("openload", {
// 		regex: /"https:\/\/openload.co\/embed\/.*?"/,
// 		name: "Openload",
// 		linkType: LinkTypes.EMBED,
// 	}),

// 	new Server("mp4upload", {
// 		regex: /"https:\/\/www.mp4upload.com\/embed-.*?"/,
// 		name: "Mp4Upload",
// 		linkType: LinkTypes.EMBED,
// 	}),

// 	new Server("streamango", {
// 		regex: /"https:\/\/streamango.com\/embed\/.*?"/,
// 		name: "Streamango",
// 		linkType: LinkTypes.EMBED,
// 	}),

// 	new Server("beta", {
// 		regex: /"https:\/\/redirector.googlevideo.com\/videoplayback\?.*?"/,
// 		name: "Beta",
// 		linkType: LinkTypes.DIRECT,
// 	}),
// ]);

// exports.kimcartoon = new ServerDictionary([
// 	new Server("openload", {
// 		regex: /"https:\/\/openload.co\/embed\/.*?"/,
// 		name: "Openload",
// 		linkType: LinkTypes.EMBED,
// 	}),

// 	new Server("streamango", {
// 		regex: /"https:\/\/streamango.com\/embed\/.*?"/,
// 		name: "Streamango",
// 		linkType: LinkTypes.EMBED,
// 	}),

// 	new Server("beta", {
// 		regex: /"https:\/\/redirector.googlevideo.com\/videoplayback\?.*?"/,
// 		name: "Beta",
// 		linkType: LinkTypes.DIRECT,
// 	}),

// 	new Server("rapid", {
// 		regex: /"https:\/\/w*?.*?rapidvid.to\/e\/.*?"/,
// 		name: "RapidVideo",
// 		linkType: LinkTypes.EMBED,
// 	}),

// 	new Server("fs", {
// 		regex: /"https:\/\/video.xx.fbcdn.net\/v\/.*?"/,
// 		name: "FS (fbcdn.net)",
// 		linkType: LinkTypes.DIRECT,
// 	}),

// 	new Server("gp", {
// 		regex: /"https:\/\/redirector.googlevideo.com\/videoplayback\?.*?"/,
// 		name: "GP (googleusercontent.com)",
// 		linkType: LinkTypes.DIRECT,
// 	}),

// 	new Server("fe", {
// 		regex: /"https:\/\/www.luxubu.review\/v\/.*?"/,
// 		name: "FE (luxubu.review)",
// 		linkType: LinkTypes.EMBED,
// 	}),
// ]);


// exports.kissasian = new ServerDictionary([
// 	new Server("openload", {
// 		regex: /"https:\/\/openload.co\/embed\/.*?"/,
// 		name: "Openload",
// 		linkType: LinkTypes.EMBED,
// 	}),

// 	new Server("beta", {
// 		regex: /"https:\/\/redirector.googlevideo.com\/videoplayback\?.*?"/,
// 		name: "Beta",
// 		linkType: LinkTypes.DIRECT,
// 	}),

// 	new Server("rapid", {
// 		regex: /"https:\/\/w*?.*?rapidvid.to\/e\/.*?"/,
// 		name: "RapidVideo",
// 		linkType: LinkTypes.EMBED,
// 	}),

// 	new Server("fe", {
// 		regex: /"https:\/\/www.gaobook.review\/v\/.*?"/,
// 		name: "FE (gaobook.review)",
// 		linkType: LinkTypes.EMBED,
// 	}),

// 	new Server("mp", {
// 		regex: /"https:\/\/www.mp4upload.com\/embed-.*?"/,
// 		name: "MP (mp4upload.com)",
// 		linkType: LinkTypes.EMBED,
// 	}),

// 	new Server("fb", {
// 		regex: /"https:\/\/video.xx.fbcdn.net\/v\/.*?"/,
// 		name: "FB (fbcdn.net)",
// 		linkType: LinkTypes.DIRECT,
// 	}),

// 	new Server("alpha", {
// 		regex: /"https:\/\/redirector.googlevideo.com\/videoplayback\?.*?"/,
// 		name: "Alpha",
// 		linkType: LinkTypes.DIRECT,
// 	}),
// ]);

// exports.kisstvshow = new ServerDictionary([
// 	new Server("openload", {
// 		regex: /"https:\/\/openload.co\/embed\/.*?"/,
// 		name: "Openload",
// 		linkType: LinkTypes.EMBED,
// 	}),

// 	new Server("streamango", {
// 		regex: /"https:\/\/streamango.com\/embed\/.*?"/,
// 		name: "Streamango",
// 		linkType: LinkTypes.EMBED,
// 	}),

// 	new Server("beta", {
// 		regex: /"https:\/\/redirector.googlevideo.com\/videoplayback\?.*?"/,
// 		name: "Beta",
// 		linkType: LinkTypes.DIRECT,
// 	}),

// 	new Server("rapid", {
// 		regex: /"https:\/\/w*?.*?rapidvid.to\/e\/.*?"/,
// 		name: "RapidVideo",
// 		linkType: LinkTypes.EMBED,
// 	}),

// 	new Server("fb", {
// 		regex: /"https:\/\/video.xx.fbcdn.net\/v\/.*?"/,
// 		name: "FB (fbcdn.net)",
// 		linkType: LinkTypes.DIRECT,
// 	}),

// 	new Server("gp", {
// 		regex: /"https:\/\/redirector.googlevideo.com\/videoplayback\?.*?"/,
// 		name: "GP (googleusercontent.com)",
// 		linkType: LinkTypes.DIRECT,
// 	}),

// 	new Server("fe", {
// 		regex: /"https:\/\/www.rubicstreaming.com\/v\/.*?"/,
// 		name: "FE (rubicstreaming.com)",
// 		linkType: LinkTypes.EMBED,
// 	}),
// ]);
