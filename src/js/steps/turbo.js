const util = require("../util"),
	statusManager = require("../statusManager"),
	config = require("../config"),
	linkDisplay = require("../UI/linkDisplay");

const status = statusManager.get(),
	site = config.sites.current();

exports.turboBegin = async () => {
	$("#KG-linkdisplay").slideDown();
	linkDisplay.showSpinner();
	let progress = 0;
	let func = async (ep) => {
		let html = (await util.ajax.get(ep.kissLink + `&s=${status.server}`)).response;
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
