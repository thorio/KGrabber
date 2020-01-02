// needed for jsdoc
/* eslint-disable no-unused-vars */
const { Status } = require("../types");
/* eslint-enable no-unused-vars */

const { LinkTypes, Exporter } = require("../types"),
	page = require("../UI/page");

module.exports = new Exporter({
	name: "html list",
	extension: "html",
	requireSamePage: true,
	linkTypes: [LinkTypes.DIRECT],
}, runExport);

/**
 * @param {Status} status
 * @returns {String}
 */
function runExport(status) {
	let listing = page.episodeList();
	let str = "<html>\n	<body>\n";
	for (let episode of status.episodes) {
		if (!episode.error) {
			str += `<a href="${episode.functionalLink}" download="${listing[episode.episodeNumber-1].innerText}.mp4">${listing[episode.episodeNumber-1].innerText}</a><br>\n`;
		}
	}
	str += "</body>\n</html>\n";
	return str;
}
