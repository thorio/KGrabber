const LinkTypes = require("../types/LinkTypes"),
	page = require("../UI/page"),
	Exporter = require("../types/Exporter");

module.exports = new Exporter({
	name: "html list",
	extension: "html",
	requireSamePage: true,
	linkTypes: [LinkTypes.DIRECT],
}, runExport);

function runExport(status) {
	let listing = page.episodeList();
	let str = "<html>\n	<body>\n";
	for (let episode of status.episodes) {
		str += `<a href="${episode.grabLink}" download="${listing[episode.num-1].innerText}.mp4">${listing[episode.num-1].innerText}</a><br>\n`;
	}
	str += "</body>\n</html>\n";
	return str;
}
