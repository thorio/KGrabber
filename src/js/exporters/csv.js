const LinkTypes = require("../types/LinkTypes"),
	page = require("../UI/page"),
	Exporter = require("../types/Exporter");

module.exports = new Exporter({
	name: "csv",
	extension: "csv",
	requireSamePage: true,
	linkTypes: [LinkTypes.DIRECT, LinkTypes.EMBED],
}, runExport);

function runExport(status) {
	let listing = page.episodeList();
	let str = "episode, name, url\n";
	for (let i in status.episodes) {
		str += `${status.episodes[i].num}, ${listing[status.episodes[i].num-1].innerText}, ${status.episodes[i].grabLink}\n`;
	}
	return str;
}
