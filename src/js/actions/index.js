// needed for jsdoc
/* eslint-disable no-unused-vars */
const Action = require("../types/Action");
/* eslint-enable no-unused-vars */

const preferenceManager = require("../config/preferenceManager"),
	statusManager = require("../statusManager");

const preferences = preferenceManager.get(),
	status = statusManager.get();

/**
 * @type {Action[]}
 */
let actions = [].concat(
	require("./rapidvideo"),
	require("./beta"),
	require("./nova")
);

/**
 * @returns {Action[]}
 */
exports.all = () =>
	actions;

/**
 * Filters actions
 * @param {String} server Identifier of the server
 * @param {String} linkType LinkType
 * @param {Boolean} automaticDone Were automatic actions already completed?
 * @returns {Action[]} List of available actions
 */
exports.available = (server, linkType, automaticDone) =>
	actions.filter((action) => {
		//exclude actions that don't support the current server
		if (!action.servers.includes(server)) {
			return false;
		}
		//exclude actions with the wrong link type
		if (action.linkType != linkType) {
			return false;
		}
		//exclude automatic actions if they were already completed or the user has disabled automatic actions
		if (action.automatic && automaticDone || preferences.compatibility.disable_automatic_actions) {
			return false;
		}
		return true;
	});

/**
 * Executes an action
 * @param {Action} action Action to be executed
 * @param {function(String):void} setSpinnerText Function that sets the UI progress text
 * @returns {Promise<void>}
 */
exports.execute = async (action, setSpinnerText) => {
	await action.invoke(status, setSpinnerText);
	if (action.automatic) {
		status.automaticDone = true;
	}
};
