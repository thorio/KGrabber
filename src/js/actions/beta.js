const util = require("../util"),
	{ log } = util,
	preferenceManager = require("../config/preferenceManager"),
	shared = require("./shared");

const preferences = preferenceManager.get();

let beta_setQuality = {
	name: "set quality",
	requireLinkType: "direct", // TODO make enum
	servers: ["beta2"],
	automatic: true,
	execute: async (status) => {
		await shared.eachEpisode(status, beta_tryGetQuality);
		status.automaticDone = true;
	},
};

async function beta_tryGetQuality(episode) {
	if (!episode.grabLink.match(/.*=m\d\d/)) {
		log.warn(`invalid beta link "${episode.grabLink}"`);
		return;
	}
	let rawLink = episode.grabLink.slice(0, -4);
	let qualityStrings = { "1080": "=m37", "720": "=m22", "360": "=m18" };
	let parsedQualityPrefs = preferences.general.quality_order.replace(/\s/g, "").split(",");
	for (let i of parsedQualityPrefs) {
		if (qualityStrings[i]) {
			// don't want to needlessly spam the servers
			// eslint-disable-next-line no-await-in-loop
			if (await util.ajax.head(rawLink + qualityStrings[i]).status == 200) {
				episode.grabLink = rawLink + qualityStrings[i];
				return;
			}
		}
	}
}

module.exports = [beta_setQuality];
