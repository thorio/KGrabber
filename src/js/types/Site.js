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
	 * @param {String} hostname
	 * @param {Object} obj
	 * @param {String} obj.contentPath
	 * @param {String} obj.noCaptchaServer
	 * @param {String} obj.buttonColor
	 * @param {String} obj.buttonTextColor
	 * @param {Dictionary<Server>} obj.servers
	 * @param {Function[]} [obj.patches]
	 */
	constructor(hostname, { contentPath, noCaptchaServer, buttonColor, buttonTextColor, servers, patches = [] }) {
		this.hostname = hostname;
		this.contentPath = new RegExp(`^/${contentPath}/`);
		this.noCaptchaServer = noCaptchaServer;
		this.buttonTextColor = buttonColor;
		this.buttonTextColor = buttonTextColor;
		this.servers = servers;
		this.patches = patches;
	}

	get identifier() {
		return this.hostname;
	}

	/**
	 * Checks if pathname matches contentPath
	 * @param {String} pathname
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
