/**
 * @typedef {import("kgrabber-types/Episode")} Episode
 */

const ajax = require("../util/ajax"),
	util = require("../util"),
	preferenceManager = require("../config/preferenceManager"),
	shared = require("./shared"),
	{ Action, LinkTypes } = require("kgrabber-types");

const preferences = preferenceManager.get();

module.exports = [
	new Action("get direct links", {
		executeFunc: async (status, setProgress) => {
			await shared.eachEpisode(status.episodes, getDirect, setProgress);
			status.linkType = LinkTypes.DIRECT;
		},
		availableFunc: (action, status) => {
			return shared.availableFunc(status, {
				linkType: LinkTypes.EMBED,
				servers: ["nova", "fe"],
			});
		},
	}),
];

/**
 * Asynchronously gets the direct link
 * @param {Episode} episode
 * @returns {Promise<void>}
 */
async function getDirect(episode) {
	if (episode.error) return;

	let sources = await getSources(episode);
	if (!sources) return;

	let url = findQuality(episode, sources);
	if (!url) return;

	episode.processedLink = url;
}

/**
 * @typedef FembedResponse
 * @property {boolean} success
 * @property {Source[]|string} data
 */

/**
 * @typedef Source
 * @property {string} file
 * @property {string} label
 * @property {string} type
 */

/**
 * @param {Episode} episode
 */
async function getSources(episode) {
	let response = await ajax.post(`https://www.fembed.com/api/source/${episode.functionalLink.match(/\/([^/]*?)$/)[1]}`);
	/** @type {FembedResponse} */
	let json;

	try {
		json = JSON.parse(response.response);
	} catch (error) {
		episode.error = "parsing error";
		util.log.err(episode.error, episode, response);
		return null;
	}

	if (!json.success) {
		episode.error = json.data;
		util.log.err(episode.error, episode, response);
		return null;
	}

	return json.data;
}

/**
 * @param {Episode} episode
 * @param {Source[]} sources
 */
function findQuality(episode, sources) {
	let parsedQualityPrefs = preferences.general.quality_order.replace(/\s/g, "").split(",");

	for (let quality of parsedQualityPrefs) {
		let source = sources.find((s) => s.label == quality + "p");
		if (source) return source.file;
	}

	let availableQualities = sources.map((s) => s.label).join(", ");
	episode.error = "preferred qualities not found. available: " + availableQualities;
	util.log.err(episode.error, episode, sources);
}
