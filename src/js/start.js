const config = require("./config"),
	util = require("./util"),
	steps = require("./steps"),
	page = require("./UI/page"),
	statusManager = require("./statusManager"),
	{ Episode } = require("./types");

const preferences = config.preferenceManager.get(),
	status = statusManager.get(),
	defaultStep = "defaultBegin";

/**
 * Gets links for a range of episodes
 * @param {Number} start
 * @param {Number} end
 * @param {String} serverID
 */
module.exports = (start, end, serverID) => {
	let server = config.sites.current().servers.get(serverID);
	statusManager.initialize({
		title: page.title(),
		serverID,
		linkType: server.linkType,
	});
	status.episodes = getEpisodes(start, end);
	status.func = server.getEffectiveStep(defaultStep, preferences.compatibility.enable_experimental_grabbers, !preferences.compatibility.force_default_grabber);

	statusManager.save();
	steps.execute(status.func);
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
