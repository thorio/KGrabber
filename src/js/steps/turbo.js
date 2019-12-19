// needed for jsdoc
/* eslint-disable no-unused-vars */
const Episode = require("../types/Episode");
/* eslint-enable no-unused-vars */

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
	let func = async ( /** @type {Episode} */ episode) => {
		let html = (await util.ajax.get(episode.kissLink + `&s=${status.serverID}`)).response;
		let link = site.servers.get(status.serverID).findLink(html);
		if (link) {
			episode.grabbedLink = link;
		} else {
			episode.error = "server not available or captcha";
		}
		progress++;
		linkDisplay.setSpinnerText(`${progress}/${promises.length}`);
	};
	let promises = [];
	util.for(status.episodes, (i, /** @type {Episode} */ obj) => {
		promises.push(func(obj));
	});
	linkDisplay.setSpinnerText(`0/${promises.length}`);
	await Promise.all(promises);
	status.func = "defaultFinished";
	statusManager.save();
	linkDisplay.load();
};
