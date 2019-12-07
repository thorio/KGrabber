// needed for jsdoc
/* eslint-disable no-unused-vars */
const Status = require("../types/Status");
/* eslint-enable no-unused-vars */

const LinkTypes = require("../types/LinkTypes"),
	Exporter = require("../types/Exporter");

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
	let listing = $(".listing a").get().reverse();
	let json = {
		title: status.title,
		server: status.serverID,
		linkType: status.linkType,
		episodes: [],
	};
	for (let i in status.episodes) {
		json.episodes.push({
			number: status.episodes[i].episodeNumber,
			name: listing[status.episodes[i].episodeNumber - 1].innerText,
			link: status.episodes[i].grabbedLink,
		});
	}
	return JSON.stringify(json);
}
