// needed for jsdoc
/* eslint-disable no-unused-vars */
const Episode = require("./Episode");
/* eslint-enable no-unused-vars */

/**
 * @class Status
 */
module.exports = class Status {
	/**
	 * Creates an empty object
	 */
	constructor() {
		this._reset();
		Object.seal(this);
	}

	/**
	 * Resets the object
	 * @private
	 */
	_reset() {
		/** @type {Episode[]} */
		this.episodes = [];
		this.current = 0;
		this.automaticDone = false;
		this.active = false;
		this.func = "";
		this.url = "";
		this.title = "";
		this.server = ""; // TODO rename to serverID
		this.linkType = "";
	}

	/**
	 * Initializes the object
	 * @param {Object} obj
	 * @param {string} obj.url
	 * @param {string} obj.title
	 * @param {string} obj.serverID
	 * @param {string} obj.linkType
	 */
	initialize({ url, title, serverID, linkType }) {
		this._reset();
		this.url = url;
		this.title = title;
		this.server = serverID;
		this.linkType = linkType;
	}

	/**
	 * Clears the object while preserving references to it
	 */
	clear() {
		this._reset();
	}

	/**
	 * Serializes the object to a json string
	 * @returns {String}
	 */
	serialize() {
		return JSON.stringify(this);
	}

	/**
	 * Attempts to deserialize a json string
	 * @param {String} json
	 * @returns {Status}
	 * @throws {SyntaxError} if JSON parse fails
	 */
	static deserialize(json) {
		let obj = JSON.parse(json);
		return Object.assign(new this, obj);
	}
};
