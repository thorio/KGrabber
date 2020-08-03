/**
 * @typedef {import("kgrabber-types/Action")} Action
 */

const statusManager = require("../statusManager");

const status = statusManager.get();

/**
 * @type {Action[]}
 */
let actions = [].concat(
	require("./generic"),
	require("./hydrax"),
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
 * @returns {Action[]} List of available actions
 */
exports.available = () =>
	actions.filter((action) =>
		action.isAvailable(status)
	);

/**
 * @param {...Action} action
 */
exports.add = (...action) => {
	actions.push(...action);
};

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
