/**
 * @typedef {import("../types/Status")} Status
 * @typedef {import("../types/Site")} Site
 */

const { log } = require("../util");

const steps = Object.assign({},
	require("./default"),
	require("./captchaModal")
);

/**
 * Executes a step
 * @param {String} stepName
 * @param {Status} status
 * @param {Site} site
 */
exports.execute = (stepName, status, site) => {
	if (steps[stepName]) {
		steps[stepName](status, site);
	} else {
		log.err(`tried executing invalid step '${stepName}'`, { steps });
	}
};

/**
 * Adds the given steps
 * @param {Object} steps
 */
exports.add = (newSteps) => {
	Object.assign(steps, newSteps);
};
