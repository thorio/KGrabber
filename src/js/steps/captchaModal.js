// needed for jsdoc
/* eslint-disable no-unused-vars */
const Episode = require("../types/Episode");
/* eslint-enable no-unused-vars */

const util = require("../util"),
	statusManager = require("../statusManager"),
	config = require("../config"),
	linkDisplay = require("../UI/linkDisplay"),
	captchaModal = require("../UI/captchaModal"),
	Captcha = require("../types/Captcha");

const status = statusManager.get(),
	site = config.sites.current();

exports.modalBegin = async () => {
	linkDisplay.show();
	linkDisplay.showSpinner();
	let progress = 0;
	let func = async ( /** @type {Episode} */ episode) => {
		let html = await doCaptcha(`${episode.kissLink}&s=${status.serverID}`);
		getLink(html, episode);
		progress++;
		setStatusText(`${progress}/${promises.length}`);
	};
	let promises = [];
	util.for(status.episodes, (i, /** @type {Episode} */ obj) => {
		promises.push(func(obj));
	});
	setStatusText(`0/${promises.length}`);
	await Promise.all(promises);
	status.func = "defaultFinished";
	statusManager.save();
	linkDisplay.load();
};

function setStatusText(str) {
	linkDisplay.setSpinnerText(str);
	captchaModal.setStatusText(str);
}

/**
 * Handles the entire captcha process
 * @param {String} url
 * @returns {String} html of or empty string if captcha failed
 */
async function doCaptcha(url) {
	while (true) {
		let html = (await util.ajax.get(url)).response;
		let $form = $(html).find("form#formVerify1");
		if ($form.length == 0) {
			return html; // no captcha!
		}
		let texts = [];
		$form.find("span:lt(2)").each((_i, obj) => texts.push(obj.innerText.replace(/[ \n]*(\w)/, "$1")));
		let images = [];
		$form.find("img").each((i, obj) => images.push(obj.src));
		let answerCap = (await captchaModal.queue(new Captcha(texts, images))).join(",") + ","; // trailing comma because... kissanime
		let response = (await util.ajax.post("/Special/AreYouHuman2", util.urlEncode({ reUrl: url, answerCap }), { "content-type": "application/x-www-form-urlencoded" })).response;
		if (response.includes("AreYouHuman2")) {
			continue; // captcha failed, retry
		}
		return response; // captcha completed
	}
}

/**
 * @param {String} html
 * @param {Episode} episode
 */
function getLink(html, episode) {
	let link = site.servers.get(status.serverID).findLink(html);
	if (link) {
		episode.grabbedLink = link;
	} else {
		episode.error = "error: server not available or captcha";
	}
}

/**
 * @param {String} html
 * @returns {Boolean}
 */
function isCaptcha(html) {
	return $(html).find("form#formVerify1").length > 0;
}
