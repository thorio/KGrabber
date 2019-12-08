// needed for jsdoc
/* eslint-disable no-unused-vars */
const Episode = require("../types/Episode");
/* eslint-enable no-unused-vars */

const util = require("../util");
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
