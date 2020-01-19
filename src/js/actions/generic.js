/**
 * @typedef {import("kgrabber-types/Episode")} Episode
 */

const shared = require("./shared"),
	config = require("../config"),
	{ Action } = require("kgrabber-types");

module.exports = [
	new Action("reset", {
		executeFunc: async (status, setProgress) => {
			await shared.eachEpisode(status.episodes, reset, setProgress);
			status.linkType = config.sites.current().servers.get(status.serverID).linkType;
			status.automaticDone = false;
		},
		availableFunc: (action, status) => {
			for (let episode of status.episodes) {
				if (episode.error || episode.processedLink) {
					return true;
				}
			}
			return false;
		},
	}),
];

/**
 * Resets links and errors
 * @param {Episode} episode
 * @returns {Promise<void>}
 */
async function reset(episode) {
	episode.error = "";
	episode.processedLink = "";
}
