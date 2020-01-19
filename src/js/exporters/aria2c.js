/**
 * @typedef {import("../types/Status")} Status
 */

const { LinkTypes, Exporter } = require("../types");

module.exports = new Exporter({
	name: "aria2c file",
	extension: "txt",
	requireSamePage: false,
	linkTypes: [LinkTypes.DIRECT],
}, runExport);

/**
 * @param {Status} status
 * @returns {String}
 */
function runExport(status) {
	let listing = $(".listing a").get().reverse();
	let str = "";
	for (let episode of status.episodes) {
		if (!episode.error) {
			str += `${episode.functionalLink}\n out=${listing[episode.episodeNumber-1].innerText}.mp4\n`;
		}
	}
	return str;
}
