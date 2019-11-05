const config = require("./config"),
	util = require("./util"),
	log = util.log,
	steps = require("./steps"),
	UI = require("./UI"),
	statusManager = require("./statusManager");

const status = statusManager.get(),
	site = config.sites.current();

unsafeWindow.require = require;

if (site) {
	if (util.if(location.pathname, site.contentPath) && UI.page.getTitle !== "") {
		UI.injectAll();
		util.call(site.patches);
	}

	if (status.func) {
		steps[status.func]();
	}
} else {
	log.err(`${UI.page.getHost} not supported`);
}
