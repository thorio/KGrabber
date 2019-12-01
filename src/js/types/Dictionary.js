/**
 * @class Dictionary<T>
 * @template T The type the Dictionary holds
 */
module.exports = class Dictionary {
	/**
	 * @param {T[]} [objects]
	 */
	constructor(objects = []) {
		this._data = {};
		this.add(...objects);
		Object.freeze(this);
	}

	/**
	 * Adds one or more keys to the dictionary
	 * @param {...T} objects
	 */
	add(...objects) {
		for (let object of objects) {
			if (this._data[object.identifier]) {
				throw new Error(`Duplicate key '${object.identifier}'`);
			}
			this._data[object.identifier] = object;
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
	 * @returns {T}
	 */
	get(key) {
		return this._data[key];
	}

	/**
	 * Iterates the dictionary
	 * @yields {T}
	 */
	*[Symbol.iterator]() {
		for (let i in this._data) {
			yield this._data[i];
		}
	}
};
