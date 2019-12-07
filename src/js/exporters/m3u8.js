// needed for jsdoc
/* eslint-disable no-unused-vars */
const Status = require("../types/Status");
/* eslint-enable no-unused-vars */

const LinkTypes = require("../types/LinkTypes"),
	util = require("../util"),
	Exporter = require("../types/Exporter");

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
	let listing = $(".listing a").get().reverse();
	let str = "#EXTM3U\n";
	util.for(status.episodes, (i, obj) => {
		str += `#EXTINF:0,${listing[obj.episodeNumber-1].innerText}\n${obj.grabbedLink}\n`;
	});
	return str;
}
