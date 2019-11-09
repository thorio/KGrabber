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
	if (util.if(page.location.pathname, site.contentPath) && UI.page.title() !== "") {
		UI.injectAll();
		util.call(site.patches);
	}

	if (status.func) {
		steps[status.func]();
	}
} else {
	log.err(`${UI.page.location.hostname} not supported`);
}
