const util = require("../util");

const defaultPreferences = {
	general: {
		quality_order: "1080, 720, 480, 360",
	},
	internet_download_manager: {
		idm_path: "C:\\Program Files (x86)\\Internet Download Manager\\IDMan.exe",
		download_path: "%~dp0",
		arguments: "/a",
		keep_title_in_episode_name: false,
	},
	compatibility: {
		force_default_grabber: false,
		enable_experimental_grabbers: false,
		disable_automatic_actions: false,
	},
};

let preferences;

exports.get = () => {
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

function getPreferredServers() {
	return JSON.parse(GM_getValue("preferredServers", "{}"));
}

function savePreferredServers(servers) {
	GM_setValue("preferredServers", JSON.stringify(servers));
}

exports.getPreferredServer = (host) =>
	getPreferredServers()[host];

exports.setPreferredServer = (host, server) => {
	let saved = getPreferredServers();
	saved[host] = server;
	savePreferredServers(saved);
};
