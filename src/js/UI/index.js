const css = require("../css");

const preferences = require("./preferences"),
	linkDisplay = require("./linkDisplay"),
	widget = require("./widget"),
	pageWidgets = require("./pageWidgets");

exports = module.exports = { preferences, linkDisplay, widget, pageWidgets, page: require("./page") };

function injectCss() {
	$(document.head).append(`<style>${css}</style>`);
}

exports.injectAll = () => {
	injectCss();
	linkDisplay.inject();
	preferences.inject();
	widget.show();
	pageWidgets.injectEpisodeListWidgets();
};
