const LinkTypes = require("../types/LinkTypes"),
	Exporter = require("../types/Exporter");

module.exports = new Exporter({
	name: "aria2c file",
	extension: "txt",
	requireSamePage: false,
	linkTypes: [LinkTypes.DIRECT],
}, runExport);

function runExport(status) {
	let listing = $(".listing a").get().reverse();
	let str = "";
	for (let episode of status.episodes) {
		str += `${episode.grabLink}\n out=${listing[episode.num-1].innerText}.mp4\n`;
	}
	return str;
}
