// needed for jsdoc
/* eslint-disable no-unused-vars */
const Action = require("./Action"),
	Dictionary = require("./Dictionary"),
	Exporter = require("./Exporter"),
	Server = require("./Server"),
	Site = require("./Site");
/* eslint-enable no-unused-vars */

module.exports = class PluginContext {
	/**
	 * @param {Object} obj function for adding new actions etc.
	 * @param {function(Action):void} obj.addActionFunc
	 * @param {function(Site):void} obj.addSiteFunc
	 * @param {function(Exporter):void} obj.addExporterFunc
	 * @param {function(Step):void} obj.addStepsFunc
	 * @param {Object} obj.types
	 * @param {Object} obj.ui
	 * @param {Object} obj.preferences
	 */
	constructor({ addActionFunc, addSiteFunc, addExporterFunc, addStepsFunc, types, ui, preferences }) {
		this._addActionFunc = addActionFunc;
		this._addSiteFunc = addSiteFunc;
		this._addExporterFunc = addExporterFunc;
		this._addStepsFunc = addStepsFunc;
		this.types = types;
		this.ui = ui;
		this.preferences = preferences;
		Object.freeze(this);
	}

	/**
	 * Adds a new Action to the script
	 * @param {Action} action
	 */
	addAction(action) {
		this._addActionFunc(action);
	}

	/**
	 * Adds a new Site to the script
	 * @param {Site} site
	 */
	addSite(site) {
		this._addSiteFunc(site);
	}

	/**
	 * Adds a new Exporter to the script
	 * @param {Exporter} exporter
	 */
	addExporter(exporter) {
		this._addExporterFunc(exporter);
	}

	/**
	 * Adds a new Step to the script
	 * @param {Step} step
	 */
	addSteps(step) {
		this._addStepsFunc(step);
	}
};
