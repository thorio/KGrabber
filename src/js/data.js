KG.knownServers = {
	"rapidvideo": {
		regex: '"https://www.rapidvideo.com/e/.*?"',
		name: "RapidVideo (no captcha)",
	},
	"nova": {
		regex: '"https://www.novelplanet.me/v/.*?"',
		name: "Nova Server",
	},
	"beta2": {
		regex: '"https://lh3.googleusercontent.com/.*?"',
		name: "Beta2 Server",
	},
	"p2p": {
		regex: '"https://p2p2.replay.watch/public/dist/index.html\\\\?id=.*?"',
		name: "P2P Server",
	},
	"openload": {
		regex: '"https://openload.co/embed/.*?"',
		name: "Openload",
	},
	"mp4upload": {
		regex: '"https://www.mp4upload.com/embed-.*?"',
		name: "Mp4Upload",
	},
	"streamango": {
		regex: '"https://streamango.com/embed/.*?"',
		name: "Streamango",
	},
	"beta": {
		regex: '"https://lh3.googleusercontent.com/.*?"',
		name: "Beta Server",
	},
}

KG.serverOverrides = {
	"kissanime.ru": {},
	"kimcartoon.to": {
		"rapidvideo": null,
		"p2p": null,
		"beta2": null,
		"nova": null,
		"mp4upload": null,
		"rapid": {
			regex: '"https://www.rapidvideo.com/e/.*?"',
			name: "RapidVideo",
		},
		"fs": {
			regex: '"https://video.xx.fbcdn.net/v/.*?"',
			name: "FS (fbcdn.net)",
		},
		"gp": {
			regex: '"https://lh3.googleusercontent.com/.*?"',
			name: "GP (googleusercontent.com)",
		},
		"fe": {
			regex: '"https://www.luxubu.review/v/.*?"',
			name: "FE (luxubu.review)",
		},
	},
	"kissasian.sh": {
		"rapidvideo": null,
		"p2p": null,
		"beta2": null,
		"nova": null,
		"mp4upload": null,
		"streamango": null,
		"beta": null, //should work, but script can't load data because of https/http session storage separation
		"rapid": {
			regex: '"https://www.rapidvideo.com/e/.*?"',
			name: "RapidVideo",
		},
		"fe": {
			regex: '"https://www.gaobook.review/v/.*?"',
			name: "FE (gaobook.review)",
		},
		"mp": {
			regex: '"https://www.mp4upload.com/embed-.*?"',
			name: "MP (mp4upload.com)",
		},
	},
}

KG.supportedSites = {
	"kissanime.ru": {
		contentPath: "/Anime/*",
		noCaptchaServer: "rapidvideo",
		buttonColor: "#548602",
		buttonTextColor: "#fff",
	},
	"kimcartoon.to": {
		contentPath: "/Cartoon/*",
		noCaptchaServer: "rapid",
		buttonColor: "#ecc835",
		buttonTextColor: "#000",
		optsPosition: 1,
		fixes: ["kimcartoon.to_UIFix"],
	},
	"kissasian.sh": {
		contentPath: "/Drama/*",
		noCaptchaServer: "rapid",
		buttonColor: "#F5B54B",
		buttonTextColor: "#000",
	},
}