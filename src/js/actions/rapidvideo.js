const util = require("../util"),
	{ ajax } = util,
	preferenceManager = require("../config/preferenceManager"),
	shared = require("./shared"),
	Action = require("../types/Action"),
	LinkTypes = require("../types/LinkTypes");

const preferences = preferenceManager.get();

module.exports = [
	new Action("revert domain", {
		linkType: LinkTypes.EMBED,
		servers: ["rapid"],
		automatic: true,
		// eslint-disable-next-line no-unused-vars
	}, async (status, _setProgress) => {
		for (let i in status.episodes) {
			status.episodes[i].grabLink = status.episodes[i].grabLink.replace("rapidvid.to", "rapidvideo.com");
		}
		status.automaticDone = true;
	}),
	new Action("get direct links", {
		linkType: LinkTypes.EMBED,
		servers: ["rapid"],
	}, async (status, setProgress) => {
		await shared.eachEpisode(status.episodes, _rapidvideo_getDirect, setProgress);
		status.linkType = LinkTypes.DIRECT;
	}),
];

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
