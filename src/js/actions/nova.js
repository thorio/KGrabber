// needed for jsdoc
/* eslint-disable no-unused-vars */
const Episode = require("../types/Episode");
/* eslint-enable no-unused-vars */

const ajax = require("../util/ajax"),
	preferenceManager = require("../config/preferenceManager"),
	shared = require("./shared"),
	Action = require("../types/Action"),
	LinkTypes = require("../types/LinkTypes");

const preferences = preferenceManager.get();
// TODO add error if video is being encoded
// {
// 	"success": false,
// 	"data": "We are encoding this video, please check back later"
// }

module.exports = [
	new Action("get direct links", {
		linkType: LinkTypes.EMBED,
		servers: ["nova"],
	}, async (status, setProgress) => {
		await shared.eachEpisode(status.episodes, getDirect, setProgress);
		status.linkType = LinkTypes.DIRECT;
	}),
];

/**
 * Asynchronously gets the direct link
 * @param {Episode} episode
 * @returns {Promise<void>}
 */
async function getDirect(episode) {
	if (episode.grabLink.slice(0, 5) == "error") {
		return;
	}
	let response = await ajax.post(`https://www.novelplanet.me/api/source/${episode.grabLink.match(/\/([^/]*?)$/)[1]}`);
	let json = JSON.parse(response.response);
	if (!json.data || json.data.length < 1) {
		episode.grabLink = "error: no sources found";
		return;
	}
	let sources = json.data;

	let parsedQualityPrefs = preferences.general.quality_order.replace(/\s/g, "").split(",");
	for (let i of parsedQualityPrefs) {
		for (let j of sources) {
			if (j.label == i + "p") {
				episode.grabLink = j.file;
				return;
			}
		}
	}
	episode.grabLink = "error: preferred qualities not found";
}
