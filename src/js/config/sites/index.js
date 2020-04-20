/**
 * @typedef {import("kgrabber-types/Site")} Site
 */

const { Dictionary } = require("kgrabber-types"),
	page = require("../../ui/page");

const sites = new Dictionary([
	require("./kissanime_ru"),
	require("./kimcartoon"),
	require("./kissasian"),
	require("./kisstvshow"),
]);

exports.current = () =>
	sites.get(page.location.hostname);

/**
 * @param {...Site} newSites
 */
exports.add = (...newSites) => {
	sites.add(...newSites);
};
