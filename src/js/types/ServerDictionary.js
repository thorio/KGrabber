// needed for jsdoc
// eslint-disable-next-line no-unused-vars
const Server = require("./Server");

/**
 * @class ServerDictionary
 */
module.exports = class ServerDictionary {
	/**
	 * @param {Server[]} [servers]
	 */
	constructor(servers = []) {
		this._data = {};
		this.add(...servers);
	}

	/**
	 * Adds one or more keys to the dictionary
	 * @param {...Server} servers
	 */
	add(...servers) {
		for (let server of servers) {
			if (this._data[server.identifier]) {
				throw new Error(`Duplicate key '${server.identifier}'`);
			}
			this._data[server.identifier] = server;
		}
	}

	/**
	 * Removes a key from the dictionary
	 * @param {String} key
	 */
	remove(key) {
		delete this._data[key];
	}

	/**
	 * Retrieves a key from the dictionary
	 * @param {String} key
	 */
	get(key) {
		return this._data[key];
	}

	/**
	 * Iterates the dictionary
	 */
	*[Symbol.iterator]() {
		for (let i in this._data) {
			yield this._data[i];
		}
	}
};
