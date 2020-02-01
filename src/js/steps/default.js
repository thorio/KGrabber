/**
 * @typedef {import("kgrabber-types/Site")} Site
 * @typedef {import("kgrabber-types/Status")} Status
 */

const statusManager = require("../statusManager"),
	config = require("../config"),
	linkDisplay = require("../ui/linkDisplay"),
	page = require("../ui/page");

/**
 * @param {Status} status
 */
exports.defaultBegin = (status) => {
	status.func = "defaultGetLink";
	statusManager.save();
	page.href = status.episodes[status.current].kissLink + `&s=${status.serverID}`;
};

/**
 * @param {Status} status
 */
exports.defaultGetLink = (status) => {
	if (!config.sites.current().onContentPath(page.location.pathname)) { //captcha
		return;
	}
	let episode = status.episodes[status.current];
	let link = config.sites.current().servers.get(status.serverID).findLink(document.body.innerHTML);
	if (link) {
		episode.grabbedLink = link;
	} else {
		episode.error = "selected server may not be available";
	}

	status.current++;
	if (status.current >= status.episodes.length) {
		status.func = "defaultFinished";
		page.href = status.url;
	} else {
		page.href = status.episodes[status.current].kissLink + `&s=${status.serverID}`;
	}
	statusManager.save();
};

/**
 * @param {Status} status
 * @param {Site} site
 */
exports.defaultFinished = (status, site) => {
	if (site.onContentPath(page.location.pathname)) {
		linkDisplay.load();
	}
};
