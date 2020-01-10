// needed for jsdoc
/* eslint-disable no-unused-vars */
const { Exporter } = require("../types");
/* eslint-enable no-unused-vars */

/**
 * @type {Exporter[]}
 */
const exporters = [
	require("./list"),
	require("./m3u8"),
	require("./json"),
	require("./html"),
	require("./csv"),
	require("./aria2c"),
	require("./idmbat"),
];

/**
 * Gets all exporters
 * @returns {Exporter[]}
 */
exports.all = () =>
	exporters;

/**
 * Returns all available exporters
 * @param {String} linkType
 * @param {Boolean} samePage Is the browser on the same show's page?
 * @returns {Exporter[]}
 */
exports.available = (linkType, samePage) =>
	exporters.filter((exporter) =>
		filter(exporter, linkType, samePage)
	);

/**
 * Returns all exporters, marked and sorted by availability
 * @param {String} linkType
 * @param {Boolean} samePage Is the browser on the same show's page?
 * @returns {{available:Boolean exporter:Exporter}[]}
 */
exports.sorted = (linkType, samePage) =>
	exporters.map((exporter) => {
		return { available: filter(exporter, linkType, samePage), exporter };
	})
	.sort((a, b) => b.available - a.available);

/**
 * @param {Exporter} exporter
 */
exports.add = (exporter) => {
	exporters.push(exporter);
};

/**
 * Determines wether an exporter is available
 * @param {Exporter} exporter
 * @param {String} linkType
 * @param {Boolean} samePage
 * @private
 */
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
