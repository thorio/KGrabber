const config = require("./config"),
	util = require("./util"),
	log = util.log,
	steps = require("./steps"),
	UI = require("./UI"),
	statusManager = require("./statusManager"),
	page = require("./UI/page");

const status = statusManager.get(),
	site = config.sites.current();

if (site) {
	if (site.onContentPath(page.location.pathname) && UI.page.title() !== "") {
		UI.injectAll();
		site.applyPatches();
	}

	if (status.func) {
		steps[status.func]();
	}
} else {
	log.err(`${UI.page.location.hostname} not supported`);
}
