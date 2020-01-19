/**
 * @typedef {import("../types/Episode")} Episode
 */

const util = require("../util"),
	{ ajax } = util,
	preferenceManager = require("../config/preferenceManager"),
	shared = require("./shared"),
	{ Action, LinkTypes } = require("../types"),
	HttpStatusCodes = require("http-status-codes");

const preferences = preferenceManager.get();

module.exports = [
	new Action("revert domain", {
		// eslint-disable-next-line no-unused-vars
		executeFunc: async (status, _setProgress) => {
			for (let i in status.episodes) {
				status.episodes[i].processedLink = status.episodes[i].processedLink.replace("rapidvid.to", "rapidvideo.com");
			}
		},
		availableFunc: (action, status) => {
			return shared.availableFunc(status, {
				automatic: action.automatic,
				linkType: LinkTypes.EMBED,
				servers: ["rapid"],
			});
		},
		automatic: true,
	}),
	new Action("get direct links", {
		executeFunc: async (status, setProgress) => {
			await shared.eachEpisode(status.episodes, _rapidvideo_getDirect, setProgress);
			status.linkType = LinkTypes.DIRECT;
		},
		availableFunc: (action, status) => {
			return shared.availableFunc(status, {
				automatic: action.automatic,
				linkType: LinkTypes.EMBED,
				servers: ["rapid"],
			});
		},
	}),
];

/**
 * Asynchronously gets the direct link
 * @param {Episode} episode
 * @returns {Promise<void>}
 */
async function _rapidvideo_getDirect(episode) {
	if (episode.error) {
		return;
	}
	let response = await ajax.get(episode.functionalLink);
	if (response.status != HttpStatusCodes.OK) {
		episode.error = `http status ${response.status}`;
		return;
	}
	let $html = $(response.response);
	let $sources = $html.find("source");
	if ($sources.length == 0) {
		episode.error = "no sources found";
		return;
	}

	let sources = {};
	util.for($sources, (i, obj) => {
		sources[obj.dataset.res] = obj.src;
	});
	let parsedQualityPrefs = preferences.general.quality_order.replace(/\s/g, "").split(",");
	for (let i of parsedQualityPrefs) {
		if (sources[i]) {
			episode.processedLink = sources[i];
			return;
		}
	}
	episode.error = "preferred qualities not found";
}
