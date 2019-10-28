//further options after grabbing, such as converting embed to direct links
const util = require("../util"),
	{ log, ajax } = util,
	config = require("../config"),
	everything = require("../everything");

//#region RapidVideo
exports.rapidvideo_revertDomain = {
	name: "revert domain",
	requireLinkType: "embed",
	servers: ["rapid"],
	automatic: true,
	execute: async (data) => {
		await util.timeout(5); //wait for currently running KG.displayLinks to finish
		for (let i in data.episodes) {
			data.episodes[i].grabLink = data.episodes[i].grabLink.replace("rapidvid.to", "rapidvideo.com");
		}
		data.automaticDone = true;
		everything.saveStatus();
		everything.displayLinks();
	},
}

exports.rapidvideo_getDirect = {
	name: "get direct links",
	requireLinkType: "embed",
	servers: ["rapid"],
	execute: async (data) => {
		generic_eachEpisode(data, rapidvideo_getDirect, () => {
			data.linkType = "direct";
		});
	},
}

//asynchronously gets the direct link
async function rapidvideo_getDirect(ep) {
	if (ep.grabLink.slice(0, 5) == "error") {
		return;
	}
	let response = await ajax.get(ep.grabLink);
	if (response.status != 200) {
		ep.grabLink = `error: http status ${response.status}`;
		return;
	}
	let $html = $(response.response);
	let $sources = $html.find("source");
	if ($sources.length == 0) {
		ep.grabLink = "error: no sources found";
		return;
	}

	let sources = {};
	util.for($sources, (i, obj) => {
		sources[obj.dataset.res] = obj.src;
	});
	let parsedQualityPrefs = config.preferences.general.quality_order.replace(/\s/g, "").split(",");
	for (let i of parsedQualityPrefs) {
		if (sources[i]) {
			ep.grabLink = sources[i];
			return;
		}
	}
	ep.grabLink = "error: preferred qualities not found";
}
//#endregion

//#region Beta
exports.beta_setQuality = {
	name: "set quality",
	requireLinkType: "direct",
	servers: ["beta2"],
	automatic: true,
	execute: async (data) => {
		generic_eachEpisode(data, beta_tryGetQuality, () => {
			data.automaticDone = true;
		});
	},
}

async function beta_tryGetQuality(ep) {
	if (!ep.grabLink.match(/.*=m\d\d/)) { //invalid link
		log.logwarn(`invalid beta link "${ep.grabLink}"`);
		return;
	}
	let rawLink = ep.grabLink.slice(0, -4);
	let qualityStrings = { "1080": "=m37", "720": "=m22", "360": "=m18" };
	let parsedQualityPrefs = config.preferences.general.quality_order.replace(/\s/g, "").split(",");
	for (let i of parsedQualityPrefs) {
		if (qualityStrings[i]) {
			if (await util.ajax.head(rawLink + qualityStrings[i]).status == 200) {
				ep.grabLink = rawLink + qualityStrings[i];
				return;
			}
		}
	}
}
//#endregion

//#region Nova
exports.nova_getDirect = {
	name: "get direct links",
	requireLinkType: "embed",
	servers: ["nova", "rapidvideo"],
	execute: async (data) => {
		generic_eachEpisode(data, nova_getDirect, () => {
			data.linkType = "direct";
		});
	},
}

//asynchronously gets the direct link
async function nova_getDirect(ep) {
	if (ep.grabLink.slice(0, 5) == "error") {
		return;
	}
	let response = await ajax.post(`https://www.novelplanet.me/api/source/${ep.grabLink.match(/\/([^/]*?)$/)[1]}`);
	let json = JSON.parse(response.response);
	if (!json.data || json.data.length < 1) {
		ep.grabLink = "error: no sources found";
		return;
	}
	let sources = json.data;

	let parsedQualityPrefs = config.preferences.general.quality_order.replace(/\s/g, "").split(",");
	for (let i of parsedQualityPrefs) {
		for (let j of sources) {
			if (j.label == i + "p") {
				ep.grabLink = j.file;
				return;
			}
		}
	}
	ep.grabLink = "error: preferred qualities not found";
}
//#endregion

//#region Generic
async function generic_eachEpisode(data, func, fin) {
	everything.showSpinner();
	let promises = [];
	let progress = 0;
	for (let i in data.episodes) {
		promises.push(func(data.episodes[i]).then(() => {
			progress++;
			everything.spinnerText(`${progress}/${promises.length}`);
		}));
	}
	everything.spinnerText(`0/${promises.length}`);
	await Promise.all(promises);
	fin();
	everything.saveStatus();
	everything.displayLinks();
}
//#endregion
