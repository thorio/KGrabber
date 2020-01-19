const types = require("./types"),
	{ PluginContext } = types,
	util = require("./util"),
	{ preferenceManager, sites } = require("./config"),
	actions = require("./actions"),
	exporters = require("./exporters"),
	steps = require("./steps"),
	ui = require("./UI");

const $ = unsafeWindow.$, // use the jquery instance of the page, not the script
	applicationName = "KGrabberPlugin",
	allowedPluginsKey = "allowedPlugins",
	preferences = preferenceManager.get();

/** @type {String[]} */
let allowedPlugins;

exports.load = () => {
	if (!$) {
		util.log.err(`jquery not present on the page, can't load plugins`);
		return;
	}
	loadPlugins();
};

function loadPlugins() {
	getAllowedPlugins();
	let foundPlugins = discoverPlugins();
	if (foundPlugins.length > 0) {
		let context = new PluginContext({
			addActionFunc: actions.add,
			addSiteFunc: sites.add,
			addExporterFunc: exporters.add,
			addStepsFunc: steps.add,
			types,
			ui,
			preferences,
		});

		for (let pluginID of foundPlugins) {
			if (!allowedPlugins.includes(pluginID)) {
				if (confirm(`allow plugin '${pluginID}'?`)) {
					allowPlugin(pluginID);
				} else {
					continue; // do not load the plugin
				}
			}
			loadPlugin(pluginID, context);
		}
	}
}

/**
 * Communicates with other scripts and returns a list of found plugins
 * @returns {String[]}
 */
function discoverPlugins() {
	let foundPlugins = [];

	$(document).on(`${applicationName}/DiscoverResponse`, (e, { pluginID }) => {
		foundPlugins.push(pluginID.toString());
	});
	$(document).trigger(`${applicationName}/DiscoverRequest`);
	return foundPlugins;
}

function loadPlugin(pluginID, context) {
	util.log.debug(`loading plugin '${pluginID}'`);
	$(document).trigger(`${applicationName}/LoadPlugin-${pluginID}`, context);
}

function getAllowedPlugins() {
	try {
		allowedPlugins = JSON.parse(GM_getValue(allowedPluginsKey));
	} catch (e) {
		allowedPlugins = [];
		saveAllowedPlugins();
	}
}

function saveAllowedPlugins() {
	GM_setValue(allowedPluginsKey, JSON.stringify(allowedPlugins));
}

function allowPlugin(pluginID) {
	allowedPlugins.push(pluginID);
	saveAllowedPlugins();
}