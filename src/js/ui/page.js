const util = require("../util");

/**
 * @returns {Number} Number of episodes
 */
exports.episodeCount = () =>
	$(".listing a").length;

/**
 * @returns {String} Page title (Show name)
 */
exports.title = () =>
	$(".bigBarContainer a.bigChar").text();

/**
 * @returns {Boolean}
 */
exports.noTitle = () =>
	exports.title() == "";

/**
 * @returns {HTMLAnchorElement[]} List of the episode anchor elements
 */
exports.episodeList = () =>
	$(`.listing a`).get()
		.reverse(); // get chronological order

/**
 * Reloads the page
 */
exports.reload = () =>
	location.reload();

Object.defineProperty(exports, "href", {
	get: () => location.href,
	set: (href) => { location.href = href; },
});

Object.defineProperty(exports, "location", {
	/** @returns {Location} */
	get: () => util.merge({}, location), // make a copy of location to disallow writes
});

/**
 * Enables/Disables scrolling
 */
exports.scroll = (enable) => {
	$(document.body).css("overflow", enable ? "" : "hidden");
};
