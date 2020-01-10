const { log } = require("../util");

const steps = Object.assign({},
	require("./default"),
	require("./captchaModal")
);

/**
 * Executes a step
 * @param {String} stepName
 */
exports.execute = (stepName) => {
	if (steps[stepName]) {
		steps[stepName]();
	} else {
		log.err(`tried executing invalid step '${stepName}'`);
	}
};

/**
 * Adds the given steps
 * @param {Object} steps
 */
exports.add = (newSteps) => {
	Object.assign(steps, newSteps);
};
