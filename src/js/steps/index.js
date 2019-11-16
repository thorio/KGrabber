//allows multiple different approaches to collecting links
const util = require("../util"),
	ajax = util.ajax,
	statusManager = require("../statusManager"),
	config = require("../config"),
	linkDisplay = require("../UI/linkDisplay"),
	page = require("../UI/page");

const status = statusManager.get(),
	site = config.sites.current();

//#region Default
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
//#endregion

//#region Turbo
exports.turboBegin = async () => {
	$("#KG-linkdisplay").slideDown();
	linkDisplay.showSpinner();
	let progress = 0;
	let func = async (ep) => {
		let html = (await ajax.get(ep.kissLink + `&s=${status.server}`)).response;
		let link = site.servers.get(status.server).findLink(html);
		ep.grabLink = link || "error: server not available or captcha";
		progress++;
		linkDisplay.setSpinnerText(`${progress}/${promises.length}`);
	};
	let promises = [];
	util.for(status.episodes, (i, obj) => {
		promises.push(func(obj));
	});
	linkDisplay.setSpinnerText(`0/${promises.length}`);
	await Promise.all(promises);
	status.func = "defaultFinished";
	statusManager.save();
	linkDisplay.load();
};
//#endregion
