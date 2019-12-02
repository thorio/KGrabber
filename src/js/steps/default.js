const statusManager = require("../statusManager"),
	config = require("../config"),
	linkDisplay = require("../UI/linkDisplay"),
	page = require("../UI/page");

const status = statusManager.get(),
	site = config.sites.current();

exports.defaultBegin = () => {
	status.func = "defaultGetLink";
	statusManager.save();
	page.href = status.episodes[status.current].kissLink + `&s=${status.server}`;
};

exports.defaultGetLink = () => {
	if (!site.onContentPath(page.location.pathname)) { //captcha
		return;
	}
	let link = site.servers.get(status.server).findLink(document.body.innerHTML);
	status.episodes[status.current].grabLink = link || "error (selected server may not be available)";

	status.current++;
	if (status.current >= status.episodes.length) {
		status.func = "defaultFinished";
		page.href = status.url;
	} else {
		page.href = status.episodes[status.current].kissLink + `&s=${status.server}`;
	}
	statusManager.save();
};

exports.defaultFinished = () => {
	linkDisplay.load();
};
