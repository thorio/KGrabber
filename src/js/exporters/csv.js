/**
 * @typedef {import("kgrabber-types/Status")} Status
 */

const { LinkTypes, Exporter } = require("kgrabber-types"),
	page = require("../UI/page");

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
