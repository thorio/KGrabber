/**
 * @typedef {import("kgrabber-types/Site")} Site
 */

const { Dictionary } = require("kgrabber-types"),
	page = require("../../UI/page");

const sites = new Dictionary([
	require("./kissanime"),
	require("./kimcartoon"),
	require("./kissasian"),
	require("./kisstvshow"),
]);

exports.current = () =>
	sites.get(page.location.hostname);

/**
 * @param {Site} site
 */
exports.add = (site) => {
	sites.add(site);
};
