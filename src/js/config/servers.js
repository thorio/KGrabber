let kissanime = exports["kissanime.ru"] = {
	"rapidvideo": {
		regex: '"https://www.novelplanet.me/v/.*?"',
		name: "RapidNova (no captcha)",
		linkType: "embed",
		customStep: "turboBegin",
	},
	"hydrax": {
		regex: '"https://replay.watch/hydrax.html\\??.*?#slug=.*?"',
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
		regex: '"https://redirector.googlevideo.com/videoplayback\\?.*?"',
		name: "Beta",
		linkType: "direct",
	},
};

let kimcartoon = exports["kimcartoon.to"] = {
	"openload": kissanime.openload,
	"streamango": kissanime.streamango,
	"beta": kissanime.beta,
	"rapid": {
		regex: kissanime.rapidvideo.regex,
		name: "RapidVideo",
		linkType: "embed",
	},
	"fs": {
		regex: '"https://video.xx.fbcdn.net/v/.*?"',
		name: "FS (fbcdn.net)",
		linkType: "direct",
	},
	"gp": {
		regex: kissanime.beta.regex,
		name: "GP (googleusercontent.com)",
		linkType: "direct",
	},
	"fe": {
		regex: '"https://www.luxubu.review/v/.*?"',
		name: "FE (luxubu.review)",
		linkType: "embed",
	},
};

let kissasian = exports["kissasian.sh"] = {
	"openload": kissanime.openload,
	"beta": kissanime.beta,
	"rapid": kimcartoon.rapid,
	"fe": {
		regex: '"https://www.gaobook.review/v/.*?"',
		name: "FE (gaobook.review)",
		linkType: "embed",
	},
	"mp": {
		regex: kissanime.mp4upload.regex,
		name: "MP (mp4upload.com)",
		linkType: "embed",
	},
	"fb": {
		regex: kimcartoon.fs.regex,
		name: "FB (fbcdn.net)",
		linkType: "direct",
	},
	"alpha": {
		regex: kissanime.beta,
		name: "Alpha",
		linkType: "direct",
	},
};

let kisstvshow = exports["kisstvshow.to"] = {
	"openload": kissanime.openload,
	"streamango": kissanime.streamango,
	"beta": kissanime.beta,
	"rapid": kimcartoon.rapid,
	"fb": {
		regex: kimcartoon.fs.regex,
		name: "FB (fbcdn.net)",
		linkType: "direct",
	},
	"gp": {
		regex: kissasian.alpha.regex,
		name: "GP (googleusercontent.com)",
		linkType: "direct",
	},
	"fe": {
		regex: '"https://www.rubicstreaming.com/v/.*?"',
		name: "FE (rubicstreaming.com)",
		linkType: "embed",
	},
};
