/**
 * @typedef {import("./Status")} Status
 */

/**
 * Represents an action that can be performed after links have been retrieved
 * @class Action
 */
module.exports = class Action {
	/**
	 * @param {String} name Display name
	 * @param {Object} obj
	 * @param {function(Action, Status):Boolean} obj.availableFunc Determines whether the action should be displayed
	 * @param {function(Status, function(String):void):Promise<void>} obj.executeFunc Executes the action
	 * @param {Boolean} [obj.automatic] Should the action be performed automatically?
	 */
	constructor(name, { availableFunc, executeFunc, automatic = false }) {
		this.name = name;
		this.automatic = automatic;
		this._executeFunc = executeFunc;
		this._availableFunc = availableFunc;
		Object.freeze(this);
	}

	/**
	 * @param {Status} status
	 * @returns {Boolean}
	 */
	isAvailable(status) {
		return this._availableFunc(this, status);
	}

	/**
	 * Executes the action
	 * @param {Status} status
	 * @param {function(String):void} setProgress Function that sets the UI progress text
	 * @return {Promise<void>} Resolves when the Action is complete
	 */
	invoke(status, setProgress) {
		return this._executeFunc(status, setProgress);
	}
};
