/**
 * @typedef {import("kgrabber-types/Status")} Status
 */

const { LinkTypes, Exporter } = require("kgrabber-types"),
	page = require("../ui/page");

module.exports = new Exporter({
	name: "json",
	extension: "json",
	requireSamePage: true,
	linkTypes: [LinkTypes.DIRECT, LinkTypes.EMBED],
}, runExport);

/**
 * @param {Status} status
 * @returns {String}
 */
function runExport(status) {
	let listing = page.episodeList();
	let json = {
		version: "2.0",
		scriptVersion: GM_info.script.version,
		episodes: [],
		url: status.url,
		title: status.title,
		serverID: status.serverID,
		linkType: status.linkType,
	};
	for (let episode of status.episodes) {
		json.episodes.push({
			grabbedLink: episode.grabbedLink,
			processedLink: episode.processedLink,
			error: episode.error,
			episodeNumber: episode.episodeNumber,
			name: listing[episode.episodeNumber - 1].innerText,
		});
	}
	return JSON.stringify(json);
}
