/**
 * @typedef {import("../types/Status")} Status
 */

const { LinkTypes, Exporter } = require("../types"),
	page = require("../UI/page");

module.exports = new Exporter({
	name: "m3u8 playlist",
	extension: "m3u8",
	requireSamePage: true,
	linkTypes: [LinkTypes.DIRECT],
}, runExport);

/**
 * @param {Status} status
 * @returns {String}
 */
function runExport(status) {
	let listing = page.episodeList();
	let str = "#EXTM3U\n";
	for (let episode of status.episodes) {
		if (!episode.error) {
			str += `#EXTINF:0,${listing[episode.episodeNumber-1].innerText}\n${episode.functionalLink}\n`;
		}
	}
	return str;
}
