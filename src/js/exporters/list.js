const LinkTypes = require("../types/LinkTypes"),
	Exporter = require("../types/Exporter");

module.exports = new Exporter({
	name: "list",
	extension: "txt",
	requireSamePage: false,
	linkTypes: [LinkTypes.DIRECT, LinkTypes.EMBED],
}, runExport);

function runExport(status) {
	let str = "";
	for (let i in status.episodes) {
		str += status.episodes[i].grabLink + "\n";
	}
	return str;
}
