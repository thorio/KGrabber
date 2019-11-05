const shared = require("./shared"),
	html = require("../html"),
	config = require("../config"),
	util = require("../util"),
	log = util.log,
	page = require("./page"),
	start = require("../start"),
	preferenceManager = require("../config/preferenceManager"),
	preferencesUI = require("./preferences");

let site = config.sites.current();

exports.show = () => {
	inject();
	load();
	setServer(preferenceManager.getPreferredServer(page.getHost()));
	markAvailableServers(util.last(page.getEpisodeList()), site.noCaptchaServer);
};

function inject() {
	let optsPosition = site.optsPosition || 0;
	$(`#rightside .clear2:eq(${optsPosition})`).after(html.widget);
}

function load() {
	let epCount = page.getEpisodeCount();

	$("#KG-input-to").val(epCount)
		.attr("max", epCount);
	$("#KG-input-from").attr("max", epCount);
	for (let i in site.servers) {
		$(`<option value="${i}">${site.servers[i].name}</>`)
			.appendTo("#KG-input-server");
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
	$("#KG-input-server").change(() => {
		preferenceManager.setPreferredServer(page.getHost(), getServer());
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

	$("#KG-input-server option").each((i, obj) => {
		if (servers.indexOf(obj.value) < 0) {
			$(obj).css("color", "#888");
		}
	});
}

let setServer = (server) =>
	$("#KG-input-server").val(server);

let getServer = exports.getServer = () =>
	$("#KG-input-server").val();

let getStartEpisode = () =>
	$('#KG-input-from').val();

let getEndEpisode = () =>
	$('#KG-input-to').val();
