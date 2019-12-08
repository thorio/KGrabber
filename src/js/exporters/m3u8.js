// needed for jsdoc
/* eslint-disable no-unused-vars */
const Status = require("../types/Status");
/* eslint-enable no-unused-vars */

const LinkTypes = require("../types/LinkTypes"),
	Exporter = require("../types/Exporter"),
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
