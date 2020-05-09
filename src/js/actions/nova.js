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
				servers: ["nova"],
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
	if (episode.error) {
		return;
	}
	let response = await ajax.post(`https://www.novelplanet.me/api/source/${episode.functionalLink.match(/\/([^/]*?)$/)[1]}`);
	if (response.success === false && response.data.includes("encoding")) {
		episode.error = "video is still being encoded";
		util.log.err(`nova: ${episode.error}`, response);
		return;
	}
	let json = JSON.parse(response.response);
	if (!json.data || json.data.length < 1) {
		episode.error = "no sources found";
		util.log.err(`nova: ${episode.error}`, response);
		return;
	}
	let sources = json.data;

	let parsedQualityPrefs = preferences.general.quality_order.replace(/\s/g, "").split(",");
	for (let i of parsedQualityPrefs) {
		for (let j of sources) {
			if (j.label == i + "p") {
				episode.processedLink = j.file;
				return;
			}
		}
	}
	episode.error = "preferred qualities not found";
	util.log.err(`nova: ${episode.error}`, response);
}
