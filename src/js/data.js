KG.knownServers = {};
KG.knownServers["kissanime.ru"] = {
	"rapidvideo": {
		regex: '"https://w*?.*?rapidvid.to/e/.*?"',
		name: "RapidVideo (no captcha)",
		linkType: "embed",
		customStep: "turboBegin",
	},
	"hydrax": {
		regex: '"https://replay.watch/hydrax.html#slug=.*?"',
		name: "HydraX (no captcha)",
		linkType: "embed",
		customStep: "turboBegin",
	},
	"nova": {
		regex: '"https://www.novelplanet.me/v/.*?"',
		name: "Nova",
		linkType: "embed",
	},
	"beta2": {
		regex: '"https://lh3.googleusercontent.com/.*?"',
		name: "Beta2",
		linkType: "direct",
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
		name: "Beta",
		linkType: "direct",
	},
}

KG.knownServers["kimcartoon.to"] = {
	"openload": KG.knownServers["kissanime.ru"].openload,
	"streamango": KG.knownServers["kissanime.ru"].streamango,
	"beta": KG.knownServers["kissanime.ru"].beta,
	"rapid": {
		regex: KG.knownServers["kissanime.ru"].rapidvideo.regex,
		name: "RapidVideo",
		linkType: "embed",
	},
	"fs": {
		regex: '"https://video.xx.fbcdn.net/v/.*?"',
		name: "FS (fbcdn.net)",
		linkType: "direct",
	},
	"gp": {
		regex: KG.knownServers["kissanime.ru"].beta.regex,
		name: "GP (googleusercontent.com)",
		linkType: "direct",
	},
	"fe": {
		regex: '"https://www.luxubu.review/v/.*?"',
		name: "FE (luxubu.review)",
		linkType: "embed",
	},
}

KG.knownServers["kissasian.sh"] = {
	"openload": KG.knownServers["kissanime.ru"].openload,
	"beta": KG.knownServers["kissanime.ru"].beta,
	"rapid": KG.knownServers["kimcartoon.to"].rapid,
	"fe": {
		regex: '"https://www.gaobook.review/v/.*?"',
		name: "FE (gaobook.review)",
		linkType: "embed",
	},
	"mp": {
		regex: KG.knownServers["kissanime.ru"].mp4upload.regex,
		name: "MP (mp4upload.com)",
		linkType: "embed",
	},
	"fb": {
		regex: KG.knownServers["kimcartoon.to"].fs.regex,
		name: "FB (fbcdn.net)",
		linkType: "direct",
	},
	"alpha": {
		regex: '"https://redirector.googlevideo.com/videoplayback\\?.*?"',
		name: "Alpha",
		linkType: "direct",
	},
}

KG.knownServers["kisstvshow.to"] = {
	"openload": KG.knownServers["kissanime.ru"].openload,
	"streamango": KG.knownServers["kissanime.ru"].streamango,
	"beta": KG.knownServers["kissanime.ru"].beta,
	"rapid": KG.knownServers["kimcartoon.to"].rapid,
	"fb": {
		regex: KG.knownServers["kimcartoon.to"].fs.regex,
		name: "FB (fbcdn.net)",
		linkType: "direct",
	},
	"gp": {
		regex: KG.knownServers["kissasian.sh"].alpha.regex,
		name: "GP (googleusercontent.com)",
		linkType: "direct",
	},
	"fe": {
		regex: '"https://www.rubicstreaming.com/v/.*?"',
		name: "FE (rubicstreaming.com)",
		linkType: "embed",
	},
}

KG.supportedSites = {
	"kissanime.ru": {
		contentPath: "/Anime/*",
		noCaptchaServer: "hydrax",
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
	"kisstvshow.to": {
		contentPath: "/Show/*",
		noCaptchaServer: "rapid",
		buttonColor: "#F5B54B",
		buttonTextColor: "#000",
	},
}

KG.preferences = {
	general: {
		quality_order: "1080, 720, 480, 360",
	},
	internet_download_manager: {
		idm_path: "C:\\Program Files (x86)\\Internet Download Manager\\IDMan.exe",
		download_path: "%~dp0",
		arguments: "/a",
		keep_title_in_episode_name: false,
	},
	compatibility: {
		force_default_grabber: false,
		enable_experimental_grabbers: false,
		disable_automatic_actions: false,
	},
}
