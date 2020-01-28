/**
 * @typedef {import("kgrabber-types/Episode")} Episode
 * @typedef {import("kgrabber-types/Site")} Site
 * @typedef {import("kgrabber-types/Status")} Status
 */

const util = require("../util"),
	statusManager = require("../statusManager"),
	config = require("../config"),
	linkDisplay = require("../ui/linkDisplay"),
	captchaModal = require("../ui/captchaModal"),
	{ Captcha } = require("kgrabber-types");

/**
 * @param {Status} status
 */
exports.modalBegin = async (status) => {
	linkDisplay.show();
	linkDisplay.showSpinner();
	let progress = 0;
	let func = async ( /** @type {Episode} */ episode) => {
		let html = await doCaptcha(`${episode.kissLink}&s=${status.serverID}`);
		getLink(html, episode, status.serverID);
		progress++;
		setStatusText(`${progress}/${promises.length}`);
	};
	let promises = [];
	util.for(status.episodes, (i, /** @type {Episode} */ episode) => {
		promises.push(func(episode));
	});
	setStatusText(`0/${promises.length}`);
	await Promise.all(promises);
	status.func = "defaultFinished";
	statusManager.save();
	linkDisplay.load();
};

/**
 * @param {string} str
 */
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
		if (isCaptchaFail(response)) {
			continue; // captcha failed, retry
		}
		return response; // captcha completed
	}
}

/**
 * @param {String} html
 * @param {Episode} episode
 * @param {string} serverID
 */
function getLink(html, episode, serverID) {
	let link = config.sites.current().servers.get(serverID).findLink(html);
	if (link) {
		episode.grabbedLink = link;
	} else {
		episode.error = "server not available";
	}
}

/**
 * @param {String} html
 * @returns {Boolean}
 */
function isCaptchaFail(html) {
	let lowerCase = html.toLowerCase();
	return lowerCase.includes("wrong answer") || lowerCase.includes("areyouhuman2");
}
