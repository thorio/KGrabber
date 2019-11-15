const css = require("../css"),
	config = require("../config");

const preferences = exports.preferences = require("./preferences"),
	linkDisplay = exports.linkDisplay = require("./linkDisplay"),
	widget = exports.widget = require("./widget"),
	pageWidgets = exports.pageWidgets = require("./pageWidgets");

exports.page = require("./page");

function injectCss() {
	$(document.head).append(`<style>${css}</style>`);
}

exports.injectAll = () => {
	injectCss();
	linkDisplay.inject();
	preferences.inject();
	preferences.load(config.preferenceManager.get());
	widget.show();
	pageWidgets.injectEpisodeListWidgets();
};
