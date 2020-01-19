/**
 * @typedef {import("../types/Status")} Status
 */

const { LinkTypes, Exporter } = require("../types");

module.exports = new Exporter({
	name: "list",
	extension: "txt",
	requireSamePage: false,
	linkTypes: [LinkTypes.DIRECT, LinkTypes.EMBED],
}, runExport);

/**
 * @param {Status} status
 * @returns {String}
 */
function runExport(status) {
	let str = "";
	for (let episode of status.episodes) {
		if (!episode.error) {
			str += episode.functionalLink + "\n";
		}
	}
	return str;
}
