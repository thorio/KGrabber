// needed for jsdoc
/* eslint-disable no-unused-vars */
const Status = require("../types/Status");
/* eslint-enable no-unused-vars */

const LinkTypes = require("../types/LinkTypes"),
	page = require("../UI/page"),
	Exporter = require("../types/Exporter");

module.exports = new Exporter({
	name: "csv",
	extension: "csv",
	requireSamePage: true,
	linkTypes: [LinkTypes.DIRECT, LinkTypes.EMBED],
}, runExport);

/**
 * @param {Status} status
 * @returns {String}
 */
function runExport(status) {
	let listing = page.episodeList();
	let str = "episode, name, url\n";
	for (let episode of status.episodes) {
		if (!episode.error) {
			str += `${episode.episodeNumber}, ${listing[episode.episodeNumber-1].innerText}, ${episode.functionalLink}\n`;
		}
	}
	return str;
}
