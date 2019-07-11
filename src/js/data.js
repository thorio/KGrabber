KG.knownServers = {
	"rapidvideo": {
		regex: '"https://www.rapidvid.to/e/.*?"',
		name: "RapidVideo (no captcha)",
		linkType: "embed",
		customStep: "turboBegin",
	},
	"nova": {
		regex: '"https://www.novelplanet.me/v/.*?"',
		name: "Nova Server",
		linkType: "embed",
	},
	"beta2": {
		regex: '"https://lh3.googleusercontent.com/.*?"',
		name: "Beta2 Server",
		linkType: "direct",
	},
	"p2p": {
		regex: '"https://p2p2.replay.watch/public/dist/index.html\\\\?id=.*?"',
		name: "P2P Server",
		linkType: "embed",
	},
	"openload": {
		regex: '"https://openload.co/embed/.*?"',
		name: "Openload",
		linkType: "embed",
	},
	"mp4upload": {
		regex: '"https://www.mp4upload.com/embed-.*?"',
		name: "Mp4Upload",
		linkType: "embed",
	},
	"streamango": {
		regex: '"https://streamango.com/embed/.*?"',
		name: "Streamango",
		linkType: "embed",
	},
	"beta": {
		regex: '"https://lh3.googleusercontent.com/.*?"',
		name: "Beta Server",
		linkType: "direct",
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
			linkType: "embed",
			experimentalCustomStep: "turboBegin",
		},
		"fs": {
			regex: '"https://video.xx.fbcdn.net/v/.*?"',
			name: "FS (fbcdn.net)",
			linkType: "direct",
			experimentalCustomStep: "turboBegin",
		},
		"gp": {
			regex: '"https://lh3.googleusercontent.com/.*?"',
			name: "GP (googleusercontent.com)",
			linkType: "direct",
			experimentalCustomStep: "turboBegin",
		},
		"fe": {
			regex: '"https://www.luxubu.review/v/.*?"',
			name: "FE (luxubu.review)",
			linkType: "embed",
			experimentalCustomStep: "turboBegin",
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
			linkType: "embed",
			experimentalCustomStep: "turboBegin",
		},
		"fe": {
			regex: '"https://www.gaobook.review/v/.*?"',
			name: "FE (gaobook.review)",
			linkType: "embed",
			experimentalCustomStep: "turboBegin",
		},
		"mp": {
			regex: '"https://www.mp4upload.com/embed-.*?"',
			name: "MP (mp4upload.com)",
			linkType: "embed",
			experimentalCustomStep: "turboBegin",
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
		fixes: ["kissasian.sh_UIFix"],
	},
}

KG.preferences = {
	general: {
		quality_order: "1080, 720, 480, 360",
		enable_automatic_actions: true,
	},
	internet_download_manager: {
		idm_path: "C:\\Program Files (x86)\\Internet Download Manager\\IDMan.exe",
		arguments: "",
		keep_title_in_episode_name: false,
	},
	compatibility: {
		force_default_grabber: false,
		enable_experimental_grabbers: false,
	},
}