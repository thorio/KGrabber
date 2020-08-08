/**
 * @typedef {import("kgrabber-types/Status")} Status
 * @typedef {import("kgrabber-types/Episode")} Episode
 */

const { LinkTypes, Exporter } = require("kgrabber-types"),
	page = require("../ui/page"),
	util = require("../util");

const REFERER_HEADER = `# CAUTION:\n# After a substantial delay (> 5 hours) the download may fail\n# due to the server invalidating the session. Use immediately.\n#\n`;

module.exports = new Exporter({
	name: "aria2c file",
	extension: "txt",
	requireSamePage: false,
	linkTypes: [LinkTypes.DIRECT, LinkTypes.REFERER],
}, runExport);

/**
 * @param {Status} status
 * @returns {String}
 */
function runExport(status) {
	switch (status.linkType) {
		case LinkTypes.DIRECT:
			return exportDirect(status);
		case LinkTypes.REFERER:
			return exportReferer(status);
	}
}

/**
 * @param {Status} status
 * @returns {String}
 */
function exportDirect(status) {
	return baseExport(status, (episode, title) => {
		return `${episode.functionalLink}\n` +
			`  out=${title}.mp4\n`;
	});
}

/**
 * @param {Status} status
 * @returns {String}
 */
function exportReferer(status) {
	return REFERER_HEADER + baseExport(status, (episode, title) => {
		return `${episode.functionalLink.url}\n` +
			`  out=${title}.mp4\n` +
			`  header=Referer: ${episode.functionalLink.referer}\n`;
	});
}

/**
 * @param {Status} status
 * @param {function(Episode, string):string} exportEpisode
 * @returns {String}
 */
function baseExport(status, exportEpisode) {
	let listing = page.episodeList();
	let str = "";
	for (let episode of status.episodes) {
		if (!episode.error) {
			let title = listing[episode.episodeNumber - 1].innerText;
			str += exportEpisode(episode, util.replaceSpecialCharacters(title));
		}
	}
	return str;
}
