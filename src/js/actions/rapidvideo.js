const util = require("../util"),
	{ ajax } = util,
	preferenceManager = require("../config/preferenceManager"),
	shared = require("./shared");

const preferences = preferenceManager.get();

let rapidvideo_revertDomain = {
	name: "revert domain",
	requireLinkType: "embed",
	servers: ["rapid"],
	automatic: true,
	// eslint-disable-next-line no-unused-vars
	execute: async (status, _setSpinnerText) => {
		for (let i in status.episodes) {
			status.episodes[i].grabLink = status.episodes[i].grabLink.replace("rapidvid.to", "rapidvideo.com");
		}
		status.automaticDone = true;
	},
};

let rapidvideo_getDirect = {
	name: "get direct links",
	requireLinkType: "embed",
	servers: ["rapid"],
	execute: async (status) => {
		await shared.eachEpisode(status, _rapidvideo_getDirect);
		status.linkType = "direct";
	},
};

//asynchronously gets the direct link
async function _rapidvideo_getDirect(ep) {
	if (ep.grabLink.slice(0, 5) == "error") {
		return;
	}
	let response = await ajax.get(ep.grabLink);
	if (response.status != 200) { // TODO replace status codes with constants from http-status-codes
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
	let parsedQualityPrefs = preferences.general.quality_order.replace(/\s/g, "").split(",");
	for (let i of parsedQualityPrefs) {
		if (sources[i]) {
			ep.grabLink = sources[i];
			return;
		}
	}
	ep.grabLink = "error: preferred qualities not found";
}

module.exports = [rapidvideo_getDirect, rapidvideo_revertDomain];
