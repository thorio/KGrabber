const log = require("./util").log,
	page = require("./ui/page"),
	{ Status } = require("kgrabber-types");

/**
 * @type {Status}
 */
let status;

/**
 * @returns {Status}
 */
exports.get = () => {
	if (status === undefined) {
		status = load();
	}
	return status;
};

/**
 * Saves the status to sessionStorage
 */
exports.save = () => {
	sessionStorage["KG-status"] = JSON.stringify(status);
};

/**
 * Resets status
 */
exports.clear = () => {
	status.clear();
	sessionStorage.removeItem("KG-data");
};

/**
 * Initializes the status
 * @param {Object} [obj]
 * @param {String} obj.title
 * @param {String} obj.serverID
 * @param {String} obj.linkType
 */
exports.initialize = ({ title, serverID, linkType } = {}) => {
	return status.initialize({
		url: page.href,
		title,
		serverID,
		linkType,
	});
};

/**
 * Attempts to load data from session storage
 * @returns {Status}
 */
function load() {
	let json = sessionStorage["KG-status"];
	if (json) {
		try {
			return Status.deserialize(json);
		} catch (error) {
			log.err("unable to parse JSON", { error, json });
		}
	}

	// no status found or parsing failed, return new status
	return new Status();
}
