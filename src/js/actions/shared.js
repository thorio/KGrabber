/**
 * @typedef {import("kgrabber-types/Episode")} Episode
 * @typedef {import("kgrabber-types/Status")} Status
 */

const util = require("../util"),
	{ preferenceManager } = require("../config");

const preferences = preferenceManager.get();

/**
 * Executes a function for each episode and awaits them all
 * @param {Episode[]} episodes
 * @param {function(Episode):Promise<T>} func
 * @param {function(String):void} setProgress Function that sets the UI progress text
 * @return {Promise<T[]>} Resolves when the Action is complete
 * @template T Return type of your function
 */
exports.eachEpisode = (episodes, func, setProgress) => {
	let promises = [];
	let progress = 0;
	for (let episode of episodes) {
		promises.push(
			func(episode).catch((e) => {
				episode.error = "something went wrong; see console for details";
				util.log.err(e);
			}).finally(() => {
				progress++;
				setProgress(`${progress}/${promises.length}`);
			})
		);
	}
	setProgress(`0/${promises.length}`);
	return Promise.all(promises);
};

/**
 * Common logic for determining action availability
 * @param {Status} status
 * @param {Object} obj
 * @param {Boolean} obj.automatic
 * @param {String} obj.linkType
 * @param {String[]} obj.servers
 * @returns {Boolean}
 */
exports.availableFunc = (status, { automatic, linkType, servers }) => {
	//exclude actions that don't support the current server
	if (!servers.includes(status.serverID)) {
		return false;
	}
	//exclude actions with the wrong link type
	if (linkType != status.linkType) {
		return false;
	}
	//exclude automatic actions if they were already completed or the user has disabled automatic actions
	if (automatic && status.automaticDone || preferences.compatibility.disable_automatic_actions) {
		return false;
	}
	return true;
};
