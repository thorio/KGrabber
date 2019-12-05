// needed for jsdoc
/* eslint-disable no-unused-vars */
const Episode = require("../types/Episode");
/* eslint-enable no-unused-vars */

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

/**
 * Asynchronously gets the direct link
 * @param {Episode} episode
 * @returns {Promise<void>}
 */
async function _rapidvideo_getDirect(episode) {
	if (episode.grabLink.slice(0, 5) == "error") {
		return;
	}
	let response = await ajax.get(episode.grabLink);
	if (response.status != 200) { // TODO replace status codes with constants from http-status-codes
		episode.grabLink = `error: http status ${response.status}`;
		return;
	}
	let $html = $(response.response);
	let $sources = $html.find("source");
	if ($sources.length == 0) {
		episode.grabLink = "error: no sources found";
		return;
	}

	let sources = {};
	util.for($sources, (i, obj) => {
		sources[obj.dataset.res] = obj.src;
	});
	let parsedQualityPrefs = preferences.general.quality_order.replace(/\s/g, "").split(",");
	for (let i of parsedQualityPrefs) {
		if (sources[i]) {
			episode.grabLink = sources[i];
			return;
		}
	}
	episode.grabLink = "error: preferred qualities not found";
}