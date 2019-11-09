//further options after grabbing, such as converting embed to direct links
const preferenceManager = require("../config/preferenceManager"),
	statusManager = require("../statusManager");

const preferences = preferenceManager.get(),
	status = statusManager.get();

let actions = [].concat(
	require("./rapidvideo"),
	require("./beta"),
	require("./nova")
);

exports.all = () =>
	actions;

exports.available = (server, linkType, automaticDone) =>
	actions.filter((action) => {
		//exclude actions that don't support the current server
		if (!action.servers.includes(server)) {
			return false;
		}
		//exclude actions with the wrong link type
		if (action.requireLinkType != linkType) {
			return false;
		}
		//exclude automatic actions if they were already completed or the user has disabled automatic actions
		if (action.automatic && automaticDone || preferences.compatibility.disable_automatic_actions) {
			return false;
		}
		return true;
	});

exports.run = async (action, setSpinnerText) => {
	await action.execute(status, setSpinnerText);
	if (action.automatic) {
		status.automaticDone = true;
	}
};
