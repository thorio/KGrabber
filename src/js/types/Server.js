/**
 * @class Server
 */
module.exports = class Server {
	/**
	 * @param {String} identifier Has to be the same string that is used by the site
	 * @param {Object} obj
	 * @param {RegExp} obj.regex Regex that matches the server's links
	 * @param {String} obj.name Display name
	 * @param {String} obj.linkType LinkType the server uses
	 * @param {String} [obj.customStep] Overrides the first step
	 * @param {String} [obj.experimentalStep] Overrides the first step if experimental steps are enabled
	 */
	constructor(identifier, { regex, name, linkType, customStep, experimentalStep }) {
		this.identifier = identifier;
		this.regex = regex;
		this.name = name;
		this.linkType = linkType;
		this.customStep = customStep;
		this.experimentalStep = experimentalStep;
	}

	/**
	 * Determines the first step.
	 * @param {String} defaultStep
	 * @param {Boolean} experimentalEnabled
	 * @returns {String} First step for this server
	 */
	getEffectiveStep(defaultStep, experimentalEnabled) {
		return experimentalEnabled && this.experimentalStep || this.customStep || defaultStep;
	}

	/**
	 * Searches for a link in html
	 * @param {String} html
	 * @returns {String} The link found or undefined
	 */
	findLink(html) {
		return html.match(this.regex)[0]
			.split('"')[1];
	}
};
