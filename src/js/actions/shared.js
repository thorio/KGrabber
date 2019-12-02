// needed for jsdoc
/* eslint-disable no-unused-vars */
const Episode = require("../types/Episode");
/* eslint-enable no-unused-vars */

/**
 * Executes a function for each episode and awaits them all
 * @param {Episode[]} episodes
 * @param {function(Episode):T} func
 * @param {function(String):void} setProgress Function that sets the UI progress text
 * @return {Promise<T[]>} Resolves when the Action is complete
 * @template T Return type of your function
 */
exports.eachEpisode = (episodes, func, setProgress) => {
	let promises = [];
	let progress = 0;
	for (let i in episodes) {
		promises.push(func(episodes[i]).then(() => {
			progress++;
			setProgress(`${progress}/${promises.length}`);
		}));
	}
	setProgress(`0/${promises.length}`);
	return Promise.all(promises); // TODO add generic error handler
};
