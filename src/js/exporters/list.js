// needed for jsdoc
/* eslint-disable no-unused-vars */
const Status = require("../types/Status");
/* eslint-enable no-unused-vars */

const LinkTypes = require("../types/LinkTypes"),
	Exporter = require("../types/Exporter");

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
	for (let i in status.episodes) {
		str += status.episodes[i].grabbedLink + "\n";
	}
	return str;
}
