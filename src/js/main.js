const config = require("./config"),
	{ log } = require("./util"),
	steps = require("./steps"),
	UI = require("./UI"),
	statusManager = require("./statusManager"),
	page = require("./UI/page"),
	pluginLoader = require("./pluginLoader");

pluginLoader.load();

const status = statusManager.get(),
	site = config.sites.current();

if (site) {
	if (site.onContentPath(page.location.pathname) && page.title() !== "") {
		UI.injectAll();
		site.applyPatch();
	}

	if (status.func) {
		steps.execute(status.func, status, site);
	}
} else {
	log.err(`'${page.location.hostname}' is not supported`);
}
