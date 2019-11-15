//allows for multiple ways to export collected data
let exporters = [
	require("./list"),
	require("./m3u8"),
	require("./json"),
	require("./html"),
	require("./csv"),
	require("./aria2c"),
	require("./idmbat"),
];

exports.all = () =>
	exporters;

exports.available = (linkType, samePage) =>
	exporters.filter((exporter) =>
		filter(exporter, linkType, samePage)
	);

exports.sorted = (linkType, samePage) =>
	exporters.map((exporter) => {
		return { available: filter(exporter, linkType, samePage), exporter };
	})
	.sort((a, b) => b.available - a.available);

function filter(exporter, linkType, samePage) {
	//exclude exporters that are incompatible with the linktype
	if (!exporter.linkTypes.includes(linkType)) {
		return false;
	}
	//exclude exporters that need access to another page
	if (exporter.requireSamePage && !samePage) {
		return false;
	}
	return true;
}
