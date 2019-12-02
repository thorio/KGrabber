// needed for jsdoc
/* eslint-disable no-unused-vars */
const Status = require("./Status");
/* eslint-enable no-unused-vars */

/**
 * Represents an action that can be performed after links have been retrieved
 * @class Action
 */
module.exports = class Action {
	/**
	 * @param {String} name Display name
	 * @param {Object} obj
	 * @param {String} obj.linkType LinkType required
	 * @param {String[]} obj.servers List of compatible servers
	 * @param {Boolean} [obj.automatic] Should the action be automatically performed?
	 * @param {function(Status, function(String):void):Promise<void>} func Executes the action
	 */
	constructor(name, { linkType, servers, automatic = false }, func) {
		this.name = name;
		this.linkType = linkType;
		this.servers = servers;
		this.automatic = automatic;
		this._func = func;
		Object.freeze(this);
	}

	/**
	 * Executes the action
	 * @param {Status} status
	 * @param {function(String):void} setProgress Function that sets the UI progress text
	 * @return {Promise<void>} Resolves when the Action is complete
	 */
	invoke(status, setProgress) {
		return this._func(status, setProgress);
	}
};
