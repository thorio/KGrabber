// needed for jsdoc
/* eslint-disable no-unused-vars */
const Action = require("../types/Action");
/* eslint-enable no-unused-vars */

const statusManager = require("../statusManager");

const status = statusManager.get();

/**
 * @type {Action[]}
 */
let actions = [].concat(
	require("./generic"),
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
exports.available = () =>
	actions.filter((action) =>
		action.isAvailable(status)
	);

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
