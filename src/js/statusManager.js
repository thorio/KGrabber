const log = require("./util").log,
	util = require("./util");

let status;

exports.get = () => {
	if (status === undefined) {
		status = load();
	}
	return status;
};

exports.save = () =>
	sessionStorage["KG-status"] = JSON.stringify(status);

exports.clear = () => {
	util.clear(status);
	sessionStorage.clear("KG-data");
};

exports.initialize = ({ title, server, linkType } = {}) => {
	util.clear(status);
	util.merge(status, {
		url: location.href,
		episodes: [],
		current: 0,
		automaticDone: false,
		func: "defaultBegin",
		title,
		server,
		linkType,
	});
};

//attempts to load data from session storage
function load() {
	if (sessionStorage["KG-status"]) {
		try {
			return JSON.parse(sessionStorage["KG-status"]);
		} catch (e) {
			log.err("unable to parse JSON", { error: e, json: sessionStorage["KG-status"] });
		}
	}

	return {};
}
