// needed for jsdoc
/* eslint-disable no-unused-vars */
const Episode = require("../types/Episode");
/* eslint-enable no-unused-vars */

const util = require("../util"),
	preferenceManager = require("../config/preferenceManager"),
	shared = require("./shared"),
	Action = require("../types/Action"),
	LinkTypes = require("../types/LinkTypes"),
	HttpStatusCodes = require("http-status-codes");

const preferences = preferenceManager.get();

module.exports = [
	new Action("set quality", {
		linkType: LinkTypes.DIRECT,
		servers: ["beta2"],
		automatic: true,
	}, async (status, setProgress) => {
		await shared.eachEpisode(status.episodes, tryGetQuality, setProgress);
		status.automaticDone = true;
	}),
];

/**
 * Asynchronously sets the quality
 * @param {Episode} episode
 * @returns {Promise<void>}
 */
async function tryGetQuality(episode) {
	if (episode.error) {
		return;
	}
	if (!episode.functionalLink.match(/.*=m\d\d/)) {
		util.log.warn(`invalid beta link "${episode.functionalLink}"`);
		return;
	}
	let rawLink = episode.functionalLink.slice(0, -4);
	let qualityStrings = { "1080": "=m37", "720": "=m22", "360": "=m18" };
	let parsedQualityPrefs = preferences.general.quality_order.replace(/\s/g, "").split(",");
	for (let i of parsedQualityPrefs) {
		if (qualityStrings[i]) {
			if (await util.ajax.head(rawLink + qualityStrings[i]).status == HttpStatusCodes.OK) {
				episode.processedLink = rawLink + qualityStrings[i];
				return;
			}
		}
	}
}
