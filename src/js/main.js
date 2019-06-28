//entry function
KG.siteLoad = () => {
	if (!KG.supportedSites[location.hostname]) {
		console.warn("KG: site not supported");
		return;
	}

	KG.applySiteOverrides();

	if (KG.if(location.pathname, KG.supportedSites[location.hostname].contentPath) && $(".bigBarContainer .bigChar").length != 0) {
		KG.injectWidgets();
	}
	KG.loadPreferences();

	if (KG.loadStatus()) {
		KG.steps[KG.status.func]();
	}
}

//saves data to session storage
KG.saveStatus = () => {
	sessionStorage["KG-status"] = JSON.stringify(KG.status);
}

//attempts to load data from session storage
KG.loadStatus = () => {
	if (!sessionStorage["KG-status"]) {
		return false;
	}
	try {
		KG.status = JSON.parse(sessionStorage["KG-status"]);
	} catch (e) {
		console.error("KG: unable to parse JSON");
		return false;
	}
	return true;
}

//clears data from session storage
KG.clearStatus = () => {
	sessionStorage.clear("KG-data");
}

KG.loadPreferences = () => {
	try {
		var prefs = JSON.parse(GM_getValue("KG-preferences", ""));
		for (var i in prefs) { //load values while not removing new defaults
			if (KG.preferences[i] != undefined) {
				for (var j in prefs[i]) {
					if (KG.preferences[i][j] != undefined) {
						KG.preferences[i][j] = prefs[i][j];
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
	for (var i in KG.preferences) {
		var group = KG.preferences[i];
		var $group = $(`<div id="KG-preferences-container"></div>`);
		for (var j in KG.preferences[i]) {
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
					console.error(`unknown type "${typeof group[j]}" of KG.preferences.${i}.${j}`);
			}
			$group.append(html);
		}
		var headerTitle = i.replace(/_/g, " ").replace(/[a-z]+/g, (s) => {return s.charAt(0).toUpperCase() + s.slice(1)});
		$("#KG-preferences-container-outer").append(`<div class="KG-preferences-header bigChar">${headerTitle}</div>`)
			.append($group);
	}
}

KG.savePreferences = () => {
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
		KG.preferences[ids[0]][ids[1]] = value;
	});

	GM_setValue("KG-preferences", JSON.stringify(KG.preferences));
}

KG.resetPreferences = () => {
	GM_setValue("KG-preferences", "");
	location.reload();
}

//patches the knownServers object based on the current url
KG.applySiteOverrides = () => {
	var over = KG.serverOverrides[location.hostname]
	for (var i in over) {
		if (KG.knownServers[i]) {
			if (over[i] === null) { //server should be removed
				delete KG.knownServers[i];
			} else { //server should be patched
				console.err("KG: patching server entries not implemented");
			}
		} else { //server should be added
			KG.knownServers[i] = over[i];
		}
	}
}

//injects element into page
KG.injectWidgets = () => {
	var site = KG.supportedSites[location.hostname];
	var epCount = $(".listing a").length;

	//css
	$(document.head).append(`<style>${grabberCSS}</style>`);

	//KissGrabber Box
	$(`#rightside .clear2:eq(${site.optsPosition || 0})`).after(optsHTML);
	$("#KG-input-to").val(epCount)
		.attr("max", epCount);
	$("#KG-input-from").attr("max", epCount);
	for (var i in KG.knownServers) {
		$(`<option value="${i}">${KG.knownServers[i].name}</>`)
			.appendTo("#KG-input-server");
	}
	KG.markAvailableServers($(".listing tr:eq(2) a").attr("href"), site.noCaptchaServer);
	KG.loadPreferredServer();
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
	$("#leftside").prepend(linkListHTML);

	//preference panel
	$("#leftside").prepend(prefsHTML);

	//numbers and buttons on each episode
	$(".listing tr:eq(0)").prepend(`<th class="KG-episodelist-header">#</th>`);
	$(".listing tr:gt(1)").each((i, obj) => {
		$(obj).prepend(`<td class="KG-episodelist-number">${epCount-i}</td>`)
			.children(":eq(1)").prepend(`<input type="button" value="grab" class="KG-episodelist-button" onclick="KG.startSingle(${epCount-i})">&nbsp;`);
	});

	KG.applyColors();

	//fixes
	for (var i in site.fixes) {
		if (KG.fixes[site.fixes[i]]) {
			KG.fixes[site.fixes[i]]();
		} else {
			console.error(`KG: nonexistant fix "${site.fixes[i]}"`);
		}
	}
}

KG.applyColors = () => {
	var site = KG.supportedSites[location.hostname];
	$(".KG-episodelist-button").add(".KG-button")
		.css({ color: site.buttonTextColor, "background-color": site.buttonColor });
}

//grays out servers that aren't available on the url
KG.markAvailableServers = async (url, server) => {
	var servers = []
	var html = await $.get(`${url}&s=${server}`);
	$(html).find("#selectServer").children().each((i, obj) => {
		servers.push(obj.value.match(/s=\w+/g)[0].slice(2, Infinity));
	})
	if (servers.length == 0) {
		console.error("KG: no servers found");
	}

	$("#KG-input-server option").each((i, obj) => {
		if (servers.indexOf(obj.value) < 0) {
			$(obj).css("color", "#888");
		}
	});
}

//gets link for single episode
KG.startSingle = (num) => {
	KG.startRange(num, num);
}

//gets links for a range of episodes
KG.startRange = (start, end) => {
	KG.status = {
		url: location.href,
		title: $(".bigBarContainer a.bigChar").text(),
		server: $("#KG-input-server").val(),
		episodes: [],
		start: start,
		current: 0,
		func: "defaultBegin",
		linkType: KG.knownServers[$("#KG-input-server").val()].linkType,
		automaticDone: false,
	}
	var epCount = $(".listing a").length;
	KG.for($(`.listing a`).get().reverse(), start - 1, end - 1, (i, obj) => {
		KG.status.episodes.push({
			kissLink: obj.href,
			grabLink: "",
			num: i + 1,
		});
	});
	var customStep = KG.knownServers[KG.status.server].customStep;
	if (customStep && KG.steps[customStep] && !KG.preferences.compatibility.force_default_grabber) {
		KG.status.func = customStep; //use custom grabber
	}
	var experimentalCustomStep = KG.knownServers[KG.status.server].experimentalCustomStep;
	if (experimentalCustomStep && KG.steps[experimentalCustomStep] && KG.preferences.compatibility.enable_experimental_grabbers) {
		KG.status.func = experimentalCustomStep; //use experimental grabber
	}

	KG.saveStatus();
	KG.steps[KG.status.func]();
	$("html, body").animate({ scrollTop: 0 }, "slow");
}

KG.displayLinks = () => {
	var html = "";
	var padLength = Math.max(2, $(".listing a").length.toString().length);
	KG.for(KG.status.episodes, (i, obj) => {
		var num = obj.num.toString().padStart(padLength, "0");
		var number = `<div class="KG-linkdisplay-episodenumber">E${num}:</div>`;
		var link = `<a href="${obj.grabLink}" target="_blank">${obj.grabLink}</a>`;
		html += `<div class="KG-linkdisplay-row">${number} ${link}</div>`;
	});
	$("#KG-linkdisplay-text").html(`<div class="KG-linkdisplay-table">${html}</div>`);
	$("#KG-linkdisplay .KG-dialog-title").text(`Extracted Links | ${KG.status.title}`);

	//exporters
	var onSamePage = KG.status.url == location.href;
	$("#KG-input-export").empty();
	$("#KG-input-export").append(`<option value="" selected disabled hidden>Export as</option>`);
	for (var i in KG.exporters) {
		var $exporter = $(`<option value="${i}">${KG.exporters[i].name}</option>`).appendTo("#KG-input-export");
		if ((KG.exporters[i].requireSamePage && !onSamePage) ||
			(KG.exporters[i].requireDirectLinks && KG.status.linkType != "direct")
		) {
			$exporter.attr("disabled", true);
		}
	}

	//actions
	$("#KG-action-container .KG-button").remove();
	for (var i in KG.actions) {
		if (
			(!KG.actions[i].requireLinkType || KG.status.linkType == KG.actions[i].requireLinkType) &&
			KG.actions[i].servers.includes(KG.status.server)
		) {
			if (KG.actions[i].automatic && KG.preferences.general.enable_automatic_actions && !KG.status.automaticDone) {
				KG.status.automaticDone = true;
				KG.actions[i].execute(KG.status);
			}
			if (KG.status.automaticDone) {
				continue;
			}
			$("#KG-action-container")
				.append(`<input type="button" class="KG-button" value="${KG.actions[i].name}" onclick="KG.actions['${i}'].execute(KG.status)">`);
		}
	}

	//colors again
	KG.applyColors();

	$("#KG-linkdisplay").show();
}

//invokes a exporter
KG.exportData = (exporter) => {
	$("#KG-input-export").val("");

	var text = KG.exporters[exporter].export(KG.status);
	$("#KG-linkdisplay-export-text").text(text);
	$("#KG-input-export-download").attr({
		href: `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`,
		download: `${KG.status.title}.${KG.exporters[exporter].extension}`,
	})
	$("#KG-linkdisplay-export").show();
}

KG.showSpinner = () => {
	$("#KG-linkdisplay-text").html(`<div class="loader">Loading...</div><div id="KG-spinner-text"><div>`);
}

KG.spinnerText = (str) => {
	$("#KG-spinner-text").text(str);
}

//hides the linkdisplay
KG.closeLinkdisplay = () => {
	$("#KG-linkdisplay").slideUp();
	KG.clearStatus();
}

//saves a new preferred server
KG.updatePreferredServer = () => {
	localStorage["KG-preferredServer"] = $("#KG-input-server").val();
}

//loads preferred server
KG.loadPreferredServer = () => {
	$("#KG-input-server").val(localStorage["KG-preferredServer"]);
}

KG.showPreferences = () => {
	$("#KG-preferences").slideDown();
}

KG.closePreferences = () => {
	KG.savePreferences();
	$("#KG-preferences").slideUp();
}