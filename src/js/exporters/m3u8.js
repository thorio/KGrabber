const LinkTypes = require("../types/LinkTypes"),
	util = require("../util"),
	Exporter = require("../types/Exporter");

module.exports = new Exporter({
	name: "m3u8 playlist",
	extension: "m3u8",
	requireSamePage: true,
	linkTypes: [LinkTypes.DIRECT],
}, runExport);

function runExport(status) {
	let listing = $(".listing a").get().reverse();
	let str = "#EXTM3U\n";
	util.for(status.episodes, (i, obj) => {
		str += `#EXTINF:0,${listing[obj.num-1].innerText}\n${obj.grabLink}\n`;
	});
	return str;
}
