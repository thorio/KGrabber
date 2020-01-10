const statusManager = require("../statusManager"),
	config = require("../config"),
	linkDisplay = require("../UI/linkDisplay"),
	page = require("../UI/page");

const status = statusManager.get();

exports.defaultBegin = () => {
	status.func = "defaultGetLink";
	statusManager.save();
	page.href = status.episodes[status.current].kissLink + `&s=${status.serverID}`;
};

exports.defaultGetLink = () => {
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

exports.defaultFinished = () => {
	linkDisplay.load();
};
