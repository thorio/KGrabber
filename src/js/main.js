const config = require("./config"),
	{ log } = require("./util"),
	steps = require("./steps"),
	UI = require("./UI"),
	statusManager = require("./statusManager"),
	page = require("./UI/page");

const status = statusManager.get(),
	site = config.sites.current();

if (site) {
	if (site.onContentPath(page.location.pathname) && page.title() !== "") {
		UI.injectAll();
		site.applyPatch();
	}

	if (status.func) {
		steps[status.func]();
	}
} else {
	log.err(`${page.location.hostname} not supported`);
}
