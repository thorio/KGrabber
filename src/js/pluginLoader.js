const util = require("./util"),
	PluginContext = require("kgrabber-plugin/PluginContext"),
	{ preferenceManager, sites } = require("./config"),
	statusManager = require("./statusManager"),
	actions = require("./actions"),
	exporters = require("./exporters"),
	steps = require("./steps"),
	version = require("./pluginVersion"),
	semverSatisfies = require("semver/functions/satisfies"),
	ui = require("./ui/pluginExposed");

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
			addActionsFunc: actions.add,
			addSitesFunc: sites.add,
			addExportersFunc: exporters.add,
			addStepsFunc: steps.add,
			ui,
			preferences,
			statusManager,
		});

		for (let plugin of foundPlugins) {
			let expectedVersion = `^${version}`;
			if (!plugin.version || !semverSatisfies(plugin.version, expectedVersion)) {
				util.log.err(`plugin "${plugin.pluginID}" could not be loaded due to version mismatch: expected "${expectedVersion}", got "${plugin.version}"`);
				continue;
			}
			if (!allowedPlugins.includes(plugin.pluginID)) {
				if (confirm(`allow plugin '${plugin.pluginID}'?`)) {
					allowPlugin(plugin.pluginID);
				} else {
					continue; // do not load the plugin
				}
			}
			loadPlugin(plugin.pluginID, context);
		}
	}
}

/**
 * Communicates with other scripts and returns a list of found plugins
 * @returns {{pluginID: string, version: string}[]}
 */
function discoverPlugins() {
	let foundPlugins = [];

	$(document).on(`${applicationName}/DiscoverResponse`, (e, { pluginID, version }) => {
		foundPlugins.push({ pluginID, version });
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
