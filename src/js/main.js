const config = require("./config"),
	{ log } = require("./util"),
	steps = require("./steps"),
	ui = require("./ui"),
	statusManager = require("./statusManager"),
	page = require("./ui/page"),
	pluginLoader = require("./pluginLoader");

pluginLoader.load();

const status = statusManager.get(),
	site = config.sites.current();

if (site) {
	if (site.onContentPath(page.location.pathname) && !page.noTitle()) {
		ui.injectAll();
		site.applyPatch();
	}

	if (status.func) {
		steps.execute(status.func, status, site);
	}
} else {
	log.err(`'${page.location.hostname}' is not supported`);
}
