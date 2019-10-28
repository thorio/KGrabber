const config = require("./config"),
	util = require("./util"),
	log = util.log,
	steps = require("./steps"),
	fixes = require("./fixes"),
	exporters = require("./exporters"),
	actions = require("./actions"),
	css = require("./css"),
	html = require("./html");

var everything = module.exports;

//entry function
exports.siteLoad = () => {
	if (!config.sites[location.hostname]) {
		log.logwarn("site not supported");
		return;
	}

	if (util.if(location.pathname, config.sites[location.hostname].contentPath) && $(".bigBarContainer .bigChar").length != 0) {
		everything.injectWidgets();
	}
	everything.loadPreferences();

	if (everything.loadStatus()) {
		steps[everything.status.func]();
	}
}

//#region Status
//saves data to session storage
exports.saveStatus = () => {
	sessionStorage["KG-status"] = JSON.stringify(everything.status);
}

//attempts to load data from session storage
exports.loadStatus = () => {
	if (!sessionStorage["KG-status"]) {
		return false;
	}
	try {
		everything.status = JSON.parse(sessionStorage["KG-status"]);
	} catch (e) {
		log.logerr("unable to parse JSON");
		return false;
	}
	return true;
}

//clears data from session storage
exports.clearStatus = () => {
	sessionStorage.clear("KG-data");
}
//#endregion

//#region Preferences
exports.loadPreferences = () => {
	try {
		var prefs = JSON.parse(GM_getValue("KG-preferences", ""));
		for (var i in prefs) { //load values while not removing new defaults
			if (config.preferences[i] != undefined) {
				for (var j in prefs[i]) {
					if (config.preferences[i][j] != undefined) {
						config.preferences[i][j] = prefs[i][j];
					}
				}
			}
		}
	} catch (e) {
		//no preferences saved, using defaults
	}
	if ($("#KG-preferences").length == 0) {
		return;
	}
	for (var i in config.preferences) {
		var group = config.preferences[i];
		var $group = $(`<div id="KG-preferences-container"></div>`);
		for (var j in config.preferences[i]) {
			var html = "";
			switch (typeof group[j]) {
				case "string":
					html = `<div><span>${j.replace(/_/g, " ")}:</span><input type="text" value="${group[j]}" class="KG-input-text right" id="KG-preference-${i}-${j}"></div>`;
					break;
				case "boolean":
					html = `<div><span>${j.replace(/_/g, " ")}:</span><input type="checkbox" ${group[j] ? "checked" : ""} class="KG-input-checkbox right" id="KG-preference-${i}-${j}"></div>`;
					break;
				case "number":
					html = `<div><span>${j.replace(/_/g, " ")}:</span><input type="number" value="${group[j]}" class="KG-input-text right" id="KG-preference-${i}-${j}"></div>`;
					break;
				default:
					log.logerr(`unknown type "${typeof group[j]}" of config.preferences.${i}.${j}`);
			}
			$group.append(html);
		}
		var headerTitle = i.replace(/_/g, " ").replace(/[a-z]+/g, (s) => s.charAt(0).toUpperCase() + s.slice(1));
		$("#KG-preferences-container-outer").append(`<div class="KG-preferences-header KG-bigChar">${headerTitle}</div>`)
			.append($group);
	}
	everything.applyColors();
}

exports.savePreferences = () => {
	$("#KG-preferences-container input").each((i, obj) => {
		var ids = obj.id.slice(14).match(/[^-]+/g);
		var value;
		switch (obj.type) {
			case "checkbox":
				value = obj.checked;
				break;
			default:
				value = obj.value;
				break;
		}
		config.preferences[ids[0]][ids[1]] = value;
	});

	GM_setValue("KG-preferences", JSON.stringify(config.preferences));
}

exports.resetPreferences = () => {
	GM_setValue("KG-preferences", "");
	location.reload();
}
//#endregion

//#region UI
//injects element into page
exports.injectWidgets = () => {
	var site = config.sites[location.hostname];
	var epCount = $(".listing a").length;

	//css
	$(document.head).append(`<style>${css}</style>`);

	//KissGrabber Box
	$(`#rightside .clear2:eq(${site.optsPosition || 0})`).after(html.widget);
	$("#KG-input-to").val(epCount)
		.attr("max", epCount);
	$("#KG-input-from").attr("max", epCount);
	for (var i in config.servers[location.hostname]) {
		$(`<option value="${i}">${config.servers[location.hostname][i].name}</>`)
			.appendTo("#KG-input-server");
	}
	everything.markAvailableServers($(".listing tr:eq(2) a").attr("href"), site.noCaptchaServer);
	everything.loadPreferredServer();
	$("#KG-input-from").on("keydown", (e) => {
		if (e.keyCode == 13) {
			$("#KG-input-start").click();
		}
	});
	$("#KG-input-to").on("keydown", (e) => {
		if (e.keyCode == 13) {
			$("#KG-input-start").click();
		}
	});

	//link display
	$("#leftside").prepend(html.linkDisplay);

	//preference panel
	$("#leftside").prepend(html.preferences);

	//numbers and buttons on each episode
	$(".listing tr:eq(0)").prepend(`<th class="KG-episodelist-header">#</th>`);
	$(".listing tr:gt(1)").each((i, obj) => {
		$(obj).prepend(`<td class="KG-episodelist-number">${epCount-i}</td>`)
			.children(":eq(1)").prepend(`<input type="button" value="grab" class="KG-episodelist-button" onclick="KG.startSingle(${epCount-i})">&nbsp;`);
	});

	everything.applyColors();

	//fixes
	for (var i in site.fixes) {
		if (fixes[site.fixes[i]]) {
			fixes[site.fixes[i]]();
		} else {
			log.logerr(`nonexistant fix "${site.fixes[i]}"`);
		}
	}
}

exports.applyColors = () => {
	var site = config.sites[location.hostname];
	$(".KG-episodelist-button, .KG-button")
		.css({ "color": site.buttonTextColor, "background-color": site.buttonColor });
	$(".KG-bigChar")
		.css("color", $(".bigChar").css("color"));
}

//grays out servers that aren't available on the url
exports.markAvailableServers = async (url, server) => {
	var servers = []
	var html = await $.get(`${url}&s=${server}`);
	$(html).find("#selectServer").children().each((i, obj) => {
		servers.push(obj.value.match(/s=\w+/g)[0].slice(2, Infinity));
	})
	if (servers.length == 0) {
		log.logwarn("no servers found");
	}

	$("#KG-input-server option").each((i, obj) => {
		if (servers.indexOf(obj.value) < 0) {
			$(obj).css("color", "#888");
		}
	});
}

exports.displayLinks = () => {
	var html = "";
	var padLength = Math.max(2, $(".listing a").length.toString().length);
	util.for(everything.status.episodes, (i, obj) => {
		var num = obj.num.toString().padStart(padLength, "0");
		var number = `<div class="KG-linkdisplay-episodenumber">E${num}:</div>`;
		var link = `<a href="${obj.grabLink}" target="_blank">${obj.grabLink}</a>`;
		html += `<div class="KG-linkdisplay-row">${number} ${link}</div>`;
	});
	$("#KG-linkdisplay-text").html(`<div class="KG-linkdisplay-table">${html}</div>`);
	$("#KG-linkdisplay .KG-dialog-title").text(`Extracted Links | ${everything.status.title}`);

	//exporters
	var onSamePage = everything.status.url == location.href;
	$("#KG-input-export").empty();
	$("#KG-input-export").append(`<option value="" selected disabled hidden>Export as</option>`);
	for (var i in exporters) {
		var $exporter = $(`<option value="${i}">${exporters[i].name}</option>`).appendTo("#KG-input-export");
		if ((exporters[i].requireSamePage && !onSamePage) ||
			(exporters[i].requireDirectLinks && everything.status.linkType != "direct")
		) {
			$exporter.attr("disabled", true);
		}
	}

	//actions
	$("#KG-action-container .KG-button").remove();
	for (let i in actions) {
		if (
			(!actions[i].requireLinkType || everything.status.linkType == actions[i].requireLinkType) &&
			actions[i].servers.includes(everything.status.server)
		) {
			if (actions[i].automatic && !config.preferences.compatibility.disable_automatic_actions && !everything.status.automaticDone) {
				everything.status.automaticDone = true;
				actions[i].execute(everything.status);
			}
			if (actions[i].automatic && everything.status.automaticDone) {
				continue;
			}
			$(`<input type="button" class="KG-button" value="${actions[i].name}">`)
				.click(() => { actions[i].execute(everything.status) })
				.appendTo("#KG-action-container");
		}
	}

	//colors again
	everything.applyColors();

	$("#KG-linkdisplay").show();
}
//#endregion

//#region Start
//gets link for single episode
exports.startSingle = (num) => {
	everything.startRange(num, num);
}

//gets links for a range of episodes
exports.startRange = (start, end) => {
	everything.status = {
		url: location.href,
		title: $(".bigBarContainer a.bigChar").text(),
		server: $("#KG-input-server").val(),
		episodes: [],
		start: start,
		current: 0,
		func: "defaultBegin",
		linkType: config.servers[location.hostname][$("#KG-input-server").val()].linkType,
		automaticDone: false,
	}
	var epCount = $(".listing a").length;
	util.for($(`.listing a`).get().reverse(), start - 1, end - 1, (i, obj) => {
		everything.status.episodes.push({
			kissLink: obj.href,
			grabLink: "",
			num: i + 1,
		});
	});
	var customStep = config.servers[location.hostname][everything.status.server].customStep;
	if (customStep && steps[customStep] && !config.preferences.compatibility.force_default_grabber) {
		everything.status.func = customStep; //use custom grabber
	}
	var experimentalCustomStep = config.servers[location.hostname][everything.status.server].experimentalCustomStep;
	if (experimentalCustomStep && steps[experimentalCustomStep] && config.preferences.compatibility.enable_experimental_grabbers) {
		everything.status.func = experimentalCustomStep; //use experimental grabber
	}

	everything.saveStatus();
	steps[everything.status.func]();
	$("html, body").animate({ scrollTop: 0 }, "slow");
}
//#endregion

//#region Misc
//invokes an exporter
exports.exportData = (exporter) => {
	$("#KG-input-export").val("");

	var text = exporters[exporter].export(everything.status);
	$("#KG-linkdisplay-export-text").text(text);
	$("#KG-input-export-download").attr({
		href: `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`,
		download: `${everything.status.title}.${exporters[exporter].extension}`,
	})
	$("#KG-linkdisplay-export").show();
}

exports.showSpinner = () => {
	$("#KG-linkdisplay-text").html(`<div class="loader">Loading...</div><div id="KG-spinner-text"><div>`);
}

exports.spinnerText = (str) => {
	$("#KG-spinner-text").text(str);
}

//hides the linkdisplay
exports.closeLinkdisplay = () => {
	$("#KG-linkdisplay").slideUp();
	everything.clearStatus();
}

//saves a new preferred server
exports.updatePreferredServer = () => {
	localStorage["KG-preferredServer"] = $("#KG-input-server").val();
}

//loads preferred server
exports.loadPreferredServer = () => {
	$("#KG-input-server").val(localStorage["KG-preferredServer"]);
}

exports.showPreferences = () => {
	$("#KG-preferences").slideDown();
}

exports.closePreferences = () => {
	everything.savePreferences();
	$("#KG-preferences").slideUp();
}
//#endregion
