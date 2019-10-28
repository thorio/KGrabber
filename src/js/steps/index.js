//allows multiple different approaches to collecting links
const util = require("../util"),
	ajax = util.ajax,
	everything = require("../everything"),
	config = require("../config");

//#region Default
exports.defaultBegin = () => {
	everything.status.func = "defaultGetLink";
	everything.saveStatus();
	location.href = everything.status.episodes[everything.status.current].kissLink + `&s=${everything.status.server}`;
}

exports.defaultGetLink = () => {
	if (!util.if(location.pathname, config.sites[location.hostname].contentPath)) { //captcha
		return;
	}
	link = util.findLink(document.body.innerHTML, config.servers[location.hostname][everything.status.server].regex);
	everything.status.episodes[everything.status.current].grabLink = link || "error (selected server may not be available)";

	everything.status.current++;
	if (everything.status.current >= everything.status.episodes.length) {
		everything.status.func = "defaultFinished";
		location.href = everything.status.url;
	} else {
		location.href = everything.status.episodes[everything.status.current].kissLink + `&s=${everything.status.server}`;
	}
	everything.saveStatus();
}

exports.defaultFinished = () => {
	everything.displayLinks();
}
//#endregion

//#region Turbo
exports.turboBegin = async () => {
	$("#KG-linkdisplay").slideDown();
	everything.showSpinner();
	var progress = 0;
	var func = async (ep) => {
		var html = (await ajax.get(ep.kissLink + `&s=${everything.status.server}`)).response;
		var link = util.findLink(html, config.servers[location.hostname][everything.status.server].regex);
		ep.grabLink = link || "error: server not available or captcha";
		progress++;
		everything.spinnerText(`${progress}/${promises.length}`);
	};
	var promises = [];
	util.for(everything.status.episodes, (i, obj) => {
		promises.push(func(obj));
	});
	everything.spinnerText(`0/${promises.length}`)
	await Promise.all(promises);
	everything.status.func = "defaultFinished";
	everything.saveStatus();
	everything.displayLinks();
}
//#endregion
