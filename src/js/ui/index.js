const widget = require("./widget"),
	pageWidgets = require("./pageWidgets"),
	css = require("../css");

function injectCss() {
	$(document.head).append(`<style>${css}</style>`);
}

exports.injectAll = () => {
	injectCss();
	widget.show();
	pageWidgets.injectEpisodeListWidgets();
};
