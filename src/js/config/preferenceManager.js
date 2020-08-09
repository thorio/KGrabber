const util = require("../util");

const defaultPreferences = {
	general: {
		quality_order: "1080, 720, 480, 360",
	},
	downloads: {
		download_path: "{currentDirectory}/{showTitle}/{episodeName}",
	},
	internet_download_manager: {
		idm_path: "C:\\Program Files (x86)\\Internet Download Manager\\IDMan.exe",
		arguments: "/a",
	},
	compatibility: {
		force_default_grabber: false,
		enable_experimental_grabbers: false,
		disable_automatic_actions: false,
	},
};
const PATH_FILENAME_REGEX = /[/\\]((?:.(?![/\\]))+)$/;

let preferences;

/**
 * @returns {defaultPreferences}
 */
let get = exports.get = () => {
	if (preferences === undefined) {
		preferences = load(defaultPreferences);
	}
	return preferences;
};

let save = exports.save = (newPreferences) => {
	util.clear(preferences);
	util.merge(preferences, newPreferences);
	GM_setValue("KG-preferences", JSON.stringify(preferences));
};

exports.reset = () =>
	save({});

/**
 * loads user preferences from GM storage, while
 * 1) adding new keys from defaults
 * 2) removing keys that don't exist in defaults
 */
function load(defaults) {
	let saved = JSON.parse(GM_getValue("KG-preferences", "{}"));

	for (let i in saved) {
		if (defaults[i] === undefined) { // delete every category that doesn't exist in defaults
			delete saved[i];
		} else {
			for (let j in saved[i]) {
				if (defaults[i][j] === undefined) { // delete every key that doesn't exist in defaults
					delete saved[i][j];
				}
			}
		}
	}
	return util.merge(util.clone(defaults), saved);
}

/**
 * @returns {string[]}
 */
exports.getQualityPriority = () =>
	get().general.quality_order.replace(/\s/g, "").split(",");

/**
 * @typedef PathArgs
 * @property {string} currentDirectory e.g. `%~dp0` for batch files
 * @property {string} showTitle
 * @property {string} episodeName
 */

/**
 * @param {PathArgs} args
 */
exports.getDownloadPath = (args) => {
	return util.replaceTags(get().downloads.download_path, args);
};

/**
 * @param {PathArgs} args
 */
exports.getDownloadDir = (args) => {
	return this.getDownloadPath(args).replace(PATH_FILENAME_REGEX, "");
};

/**
 * @param {PathArgs} args
 */
exports.getDownloadFilename = (args) => {
	return this.getDownloadPath(args).match(PATH_FILENAME_REGEX)[1];
};

/**
 * @returns {Object<string, string>}
 */
function getPreferredServers() {
	return JSON.parse(GM_getValue("preferredServers", "{}"));
}

/**
 * @param {Object<string, string>} servers
 */
function savePreferredServers(servers) {
	GM_setValue("preferredServers", JSON.stringify(servers));
}

/**
 * @param {string} host
 */
exports.getPreferredServer = (host) =>
	getPreferredServers()[host];

/**
 * @param {string} host
 * @param {string} server
 */
exports.setPreferredServer = (host, server) => {
	let saved = getPreferredServers();
	saved[host] = server;
	savePreferredServers(saved);
};
