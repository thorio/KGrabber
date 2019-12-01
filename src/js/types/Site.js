// needed for jsdoc
/* eslint-disable no-unused-vars */
const Dictionary = require("./Dictionary"),
	Server = require("./Server");
/* eslint-enable no-unused-vars */

/**
 * @class Site
 */
module.exports = class Site {
	/**
	 * @param {String} hostname The site's hostname
	 * @param {Object} obj
	 * @param {String} obj.contentPath Path to the site's content, i.e. 'Anime'
	 * @param {String} obj.noCaptchaServer Server that doesn't require a captcha to view
	 * @param {String} obj.buttonColor Color for injected buttons
	 * @param {String} obj.buttonTextColor Text color for injected buttons
	 * @param {Dictionary<Server>} obj.servers List of servers this site provides
	 * @param {Function[]} [obj.patches] List of patches to be applied to this site
	 */
	constructor(hostname, { contentPath, noCaptchaServer, buttonColor, buttonTextColor, servers, patches = [] }) {
		this.hostname = hostname;
		this.contentPath = new RegExp(`^/${contentPath}/`);
		this.noCaptchaServer = noCaptchaServer;
		this.buttonTextColor = buttonColor;
		this.buttonTextColor = buttonTextColor;
		this.servers = servers;
		this.patches = patches;
		Object.freeze(this);
	}

	get identifier() {
		return this.hostname;
	}

	/**
	 * Checks if pathname matches contentPath
	 * @param {String} pathname Current location.pathname
	 * @returns {Boolean}
	 */
	onContentPath(pathname) {
		return this.contentPath.test(pathname);
	}

	/**
	 * Applies all patches for this Site
	 */
	applyPatches() {
		for (let patch of this.patches) {
			patch();
		}
	}
};
