// needed for jsdoc
/* eslint-disable no-unused-vars */
const Server = require("./types/Server");
/* eslint-enable no-unused-vars */

const config = require("./config"),
	util = require("./util"),
	steps = require("./steps"),
	page = require("./UI/page"),
	statusManager = require("./statusManager"),
	Episode = require("./types/Episode");

const preferences = config.preferenceManager.get(),
	status = statusManager.get(),
	site = config.sites.current(),
	defaultStep = "defaultBegin";

/**
 * Gets links for a range of episodes
 * @param {Number} start
 * @param {Number} end
 * @param {String} serverID
 */
module.exports = (start, end, serverID) => {
	let server = site.servers.get(serverID);
	statusManager.initialize({
		title: page.title(),
		serverID,
		linkType: server.linkType,
	});
	status.episodes = getEpisodes(start, end);
	status.func = determineFirstStep(server);

	statusManager.save();
	steps[status.func]();
	$("html, body").animate({ scrollTop: 0 }, "slow");
};

/**
 * Reads episodes from page
 * @param {Number} start
 * @param {Number} end
 * @returns {Episode[]}
 */
function getEpisodes(start, end) {
	let episodes = [];
	util.for(page.episodeList(), (i, obj) => {
		episodes.push(new Episode(i + 1, obj.href));
	}, {
		min: start,
		max: end,
	});

	return episodes;
}

/**
 * Determines the correct step for the combination of server settings and preferences
 * @param {Server} server
 * @returns {String}
 */
function determineFirstStep(server) {
	let step = defaultStep;

	let customStep = server.customStep;
	if (customStep && steps[customStep] && !preferences.compatibility.force_default_grabber) {
		status.func = customStep; //use custom grabber
	}

	let experimentalCustomStep = server.experimentalCustomStep;
	if (experimentalCustomStep && steps[experimentalCustomStep] && preferences.compatibility.enable_experimental_grabbers) {
		status.func = experimentalCustomStep; //use experimental grabber
	}

	return step;
}
