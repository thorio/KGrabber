const util = require("../util"),
	preferenceManager = require("../config/preferenceManager"),
	shared = require("./shared"),
	Action = require("../types/Action"),
	LinkTypes = require("../types/LinkTypes");

const preferences = preferenceManager.get();

let beta_setQuality = new Action("set quality", {
	linkType: LinkTypes.DIRECT,
	servers: ["beta2"],
	automatic: true,
}, async (status, setProgress) => {
	await shared.eachEpisode(status, beta_tryGetQuality, setProgress);
	status.automaticDone = true;
});

async function beta_tryGetQuality(episode) {
	if (!episode.grabLink.match(/.*=m\d\d/)) {
		util.log.warn(`invalid beta link "${episode.grabLink}"`);
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
