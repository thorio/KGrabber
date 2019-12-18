const preferences = require("./preferences"),
	linkDisplay = require("./linkDisplay"),
	widget = require("./widget"),
	pageWidgets = require("./pageWidgets"),
	captchaModal = require("./captchaModal"),
	page = require("./page"),
	css = require("../css");

exports = module.exports = { preferences, linkDisplay, widget, pageWidgets, captchaModal, page };

function injectCss() {
	$(document.head).append(`<style>${css}</style>`);
}

exports.injectAll = () => {
	injectCss();
	linkDisplay.inject();
	preferences.inject();
	captchaModal.inject();
	widget.show();
	pageWidgets.injectEpisodeListWidgets();
};
