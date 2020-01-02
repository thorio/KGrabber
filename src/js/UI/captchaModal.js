// needed for jsdoc
/* eslint-disable no-unused-vars */
const { Captcha } = require("../types");
/* eslint-enable no-unused-vars */

const util = require("../util"),
	html = require("../html"),
	page = require("./page"),
	{ sites } = require("../config");

/**@type {{captcha: Captcha, resolve: function():void}[]} */
let queue = [];
let injected = false;

function inject() {
	$("body").append(html.captchaModal);
	sites.current().applyPatch("captchaModal");
	injected = true;
	if (!$(".KG-captchaModal").length) util.log.err(new Error("captchaModal not injected"));
}

/**
 * @param {Captcha} captcha
 * @returns {number[]} indices of the two selected images
 */
exports.queue = (captcha) => {
	return new Promise((resolve) => {
		queue.push({ captcha, resolve });
		if (queue.length == 1) { // queue was previously empty
			show();
			queueNext();
		}
	});
};

function queueNext() {
	let current = queue[0];
	clear();
	load(current.captcha, current.resolve);
}

/**
 * Pops the first element off the queue
 */
function queuePop() {
	queue.splice(0, 1);
	if (queue.length == 0) {
		hide();
	} else {
		queueNext();
	}
}

exports.setStatusText = (text) => {
	$("#KG-captchaModal-status").text(text);
};

function show() {
	if (!injected) inject();
	$(".KG-captchaModal-container").fadeIn("fast");
	page.scroll(false);
}

function hide() {
	$(".KG-captchaModal-container").fadeOut("fast");
	page.scroll(true);
}

function clear() {
	$(".KG-captchaModal-description-header").empty();
	$(".KG-captchaModal-image-container").empty();
}

/**
 * Displays the captcha
 * @param {Captcha} captcha
 * @param {Function} resolve
 */
function load(captcha, resolve) {
	for (let text of captcha.texts) {
		$("<span>")
			.text(text)
			.appendTo(".KG-captchaModal-description-header");
	}
	for (let i in captcha.images) {
		$("<img>")
			.attr({
				"src": captcha.images[i],
				"data-index": i,
			})
			.click(
				(e) => {
					toggleImage(e.target, captcha, resolve);
				})
			.appendTo(".KG-captchaModal-image-container");
	}
	applyColors();
}

/**
 * Selects/Deselects and image and proceeds when two have been selected
 * @param {HTMLImageElement} image
 * @param {Captcha} captcha
 * @param {Function} resolve
 */
async function toggleImage(image, captcha, resolve) {
	$(image).toggleClass("active");
	let $activeImages = $(".KG-captchaModal-image-container img.active");
	if ($activeImages.length >= 2) {
		let activeIndices = [];
		$activeImages.each(
			(i, obj) => activeIndices.push(Number(obj.dataset.index))
		);

		resolve(activeIndices);
		queuePop();
	}
}

function applyColors() {

}
