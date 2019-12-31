// needed for jsdoc
/* eslint-disable no-unused-vars */
const Episode = require("../types/Episode");
/* eslint-enable no-unused-vars */

const { sites } = require("../config"),
	shared = require("./shared"),
	Action = require("../types/Action");

const site = sites.current();

module.exports = [
	new Action("reset", {
		executeFunc: async (status, setProgress) => {
			await shared.eachEpisode(status.episodes, _rapidvideo_getDirect, setProgress);
			status.linkType = site.servers.get(status.serverID).linkType;
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
async function _rapidvideo_getDirect(episode) {
	episode.error = "";
	episode.processedLink = "";
}
