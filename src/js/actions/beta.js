/**
 * @typedef {import("kgrabber-types/Episode")} Episode
 */

const util = require("../util"),
	shared = require("./shared"),
	{ Action, LinkTypes } = require("kgrabber-types");

module.exports = [
	getAction(["beta", "beta5"], LinkTypes.DIRECT),
	getAction(["beta360p"], LinkTypes.HLS),
];

/**
 * @param {String[]} servers
 * @param {String} resultType
 */
function getAction(servers, resultType) {
	return new Action("decrypt", {
		executeFunc: async (status, setProgress) => {
			await shared.eachEpisode(status.episodes, decrypt, setProgress);
			status.linkType = resultType;
		},
		availableFunc: (action, status) => {
			return shared.availableFunc(status, {
				automatic: action.automatic,
				linkType: LinkTypes.OVELWRAP,
				servers: servers,
			});
		},
		automatic: true,
	});
}

/**
 * Decrypts the link using OvelWrap
 * @param {Episode} episode
 * @returns {Promise<void>}
 */
async function decrypt(episode) {
	if (episode.error) {
		return;
	}
	episode.processedLink = await util.kissCrypto.decrypt(episode.functionalLink);
}
