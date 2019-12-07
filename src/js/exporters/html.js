// needed for jsdoc
/* eslint-disable no-unused-vars */
const Status = require("../types/Status");
/* eslint-enable no-unused-vars */

const LinkTypes = require("../types/LinkTypes"),
	page = require("../UI/page"),
	Exporter = require("../types/Exporter");

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
		str += `<a href="${episode.grabbedLink}" download="${listing[episode.episodeNumber-1].innerText}.mp4">${listing[episode.episodeNumber-1].innerText}</a><br>\n`;
	}
	str += "</body>\n</html>\n";
	return str;
}
