const config = require("./config"),
	util = require("./util"),
	steps = require("./steps"),
	page = require("./UI/page"),
	statusManager = require("./statusManager");

const preferences = config.preferenceManager.get(),
	status = statusManager.get(),
	site = config.sites.current();

//gets links for a range of episodes
module.exports = (start, end, serverName) => {
	let server = site.servers[serverName];
	statusManager.initialize({
		title: page.title(),
		server: serverName,
		linkType: server.linkType,
	});
	util.for(page.episodeList(), (i, obj) => {
		status.episodes.push({
			kissLink: obj.href,
			grabLink: "",
			num: i + 1,
		});
	}, { min: start - 1, max: end - 1 });
	let customStep = server.customStep;
	if (customStep && steps[customStep] && !preferences.compatibility.force_default_grabber) {
		status.func = customStep; //use custom grabber
	}
	let experimentalCustomStep = server.experimentalCustomStep;
	if (experimentalCustomStep && steps[experimentalCustomStep] && preferences.compatibility.enable_experimental_grabbers) {
		status.func = experimentalCustomStep; //use experimental grabber
	}

	statusManager.save();
	steps[status.func]();
	$("html, body").animate({ scrollTop: 0 }, "slow");
};
