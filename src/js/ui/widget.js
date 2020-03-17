const shared = require("./shared"),
	html = require("../html"),
	config = require("../config"),
	util = require("../util"),
	log = util.log,
	page = require("./page"),
	start = require("../start"),
	preferencesUI = require("./preferences");

exports.show = () => {
	inject();
	load();
	setServer(config.preferenceManager.getPreferredServer(page.location.hostname));
	let noCaptchaServer = config.sites.current().noCaptchaServer;
	if (noCaptchaServer != null) {
		markAvailableServers(util.last(page.episodeList()), noCaptchaServer);
	}
};

function inject() {
	$(`#rightside .rightBox:eq(0)`).after(html.widget);
	config.sites.current().applyPatch("widget");
	console.log(2)
}

function load() {
	let epCount = page.episodeCount();

	$("#KG-input-to").val(epCount)
		.attr("max", epCount);
	$("#KG-input-from").attr("max", epCount);
	for (let server of config.sites.current().servers) {
		$(`<option value="${server.identifier}">${server.name}</>`)
			.appendTo("#KG-widget-server");
	}
	setHandlers();
	shared.applyColors();
}

function setHandlers() {
	$("#KG-input-from, #KG-input-to").on("keydown", (e) => {
		if (e.keyCode == 13) {
			$("#KG-input-start").click();
		}
	});
	$("#KG-widget-server").change(() => {
		config.preferenceManager.setPreferredServer(page.location.hostname, getServer());
	});
	$(".KG-preferences-button").click(() => {
		preferencesUI.show();
	});
	$("#KG-input-start").click(() => {
		start(getStartEpisode(), getEndEpisode(), getServer());
	});
}

//grays out servers that aren't available on the latest episode
async function markAvailableServers(url, server) {
	let servers = [];
	let html = await $.get(`${url}&s=${server}`);
	$(html).find("#selectServer").children().each((i, obj) => {
		servers.push(obj.value.match(/s=\w+/g)[0].slice(2, Infinity));
	});
	if (servers.length == 0) {
		log.warn("no servers found");
	}

	$("#KG-widget-server option").each((i, obj) => {
		if (servers.indexOf(obj.value) < 0) {
			$(obj).css("color", "#888");
		}
	});
}

let setServer = (server) =>
	$("#KG-widget-server").val(server);

let getServer = exports.getServer = () =>
	$("#KG-widget-server").val();

let getStartEpisode = () =>
	$('#KG-input-from').val() - 1;

let getEndEpisode = () =>
	$('#KG-input-to').val() - 1;
