// ==UserScript==
// @name          KissGrabber
// @namespace     thorou
// @version       2.4.8
// @description   extracts embed links from kiss sites
// @author        Thorou
// @license       GPLv3 - http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright     2019 Leon Timm
// @homepageURL   https://github.com/thorio/KGrabber/
// @match         https://kissanime.ru/*
// @match         https://kimcartoon.to/*
// @match         https://kissasian.sh/*
// @match         http*://kisstvshow.to/*
// @run-at        document-end
// @noframes
// @grant         GM_xmlhttpRequest
// @grant         GM_getValue
// @grant         GM_setValue
// @connect       rapidvideo.com
// @connect       googleusercontent.com
// @connect       googlevideo.com
// ==/UserScript==

if (!unsafeWindow.jQuery) {
	console.error("KG: jQuery not present");
	return;
}

unsafeWindow.KG = {};

KG.knownServers = {
	"rapidvideo": {
		regex: '"https://w*?.*?rapidvid.to/e/.*?"',
		name: "RapidVideo (no captcha)",
		linkType: "embed",
		customStep: "turboBegin",
	},
	"nova": {
		regex: '"https://www.novelplanet.me/v/.*?"',
		name: "Nova Server",
		linkType: "embed",
	},
	"beta2": {
		regex: '"https://lh3.googleusercontent.com/.*?"',
		name: "Beta2 Server",
		linkType: "direct",
	},
	"p2p": {
		regex: '"https://p2p2.replay.watch/public/dist/index.html\\\\?id=.*?"',
		name: "P2P Server",
		linkType: "embed",
	},
	"openload": {
		regex: '"https://openload.co/embed/.*?"',
		name: "Openload",
		linkType: "embed",
	},
	"mp4upload": {
		regex: '"https://www.mp4upload.com/embed-.*?"',
		name: "Mp4Upload",
		linkType: "embed",
	},
	"streamango": {
		regex: '"https://streamango.com/embed/.*?"',
		name: "Streamango",
		linkType: "embed",
	},
	"beta": {
		regex: '"https://lh3.googleusercontent.com/.*?"',
		name: "Beta Server",
		linkType: "direct",
	},
}

KG.serverOverrides = {
	"kissanime.ru": {},
	"kimcartoon.to": {
		"rapidvideo": null,
		"p2p": null,
		"beta2": null,
		"nova": null,
		"mp4upload": null,
		"rapid": {
			regex: '"https://w*?.*?rapidvid.to/e/.*?"',
			name: "RapidVideo",
			linkType: "embed",
			experimentalCustomStep: "turboBegin",
		},
		"fs": {
			regex: '"https://video.xx.fbcdn.net/v/.*?"',
			name: "FS (fbcdn.net)",
			linkType: "direct",
			experimentalCustomStep: "turboBegin",
		},
		"gp": {
			regex: '"https://lh3.googleusercontent.com/.*?"',
			name: "GP (googleusercontent.com)",
			linkType: "direct",
			experimentalCustomStep: "turboBegin",
		},
		"fe": {
			regex: '"https://www.luxubu.review/v/.*?"',
			name: "FE (luxubu.review)",
			linkType: "embed",
			experimentalCustomStep: "turboBegin",
		},
	},
	"kissasian.sh": {
		"rapidvideo": null,
		"p2p": null,
		"beta2": null,
		"nova": null,
		"mp4upload": null,
		"streamango": null,
		"beta": null, //should work, but script can't load data because of https/http session storage separation
		"rapid": {
			regex: '"https://w*?.*?rapidvid.to/e/.*?"',
			name: "RapidVideo",
			linkType: "embed",
			experimentalCustomStep: "turboBegin",
		},
		"fe": {
			regex: '"https://www.gaobook.review/v/.*?"',
			name: "FE (gaobook.review)",
			linkType: "embed",
			experimentalCustomStep: "turboBegin",
		},
		"mp": {
			regex: '"https://www.mp4upload.com/embed-.*?"',
			name: "MP (mp4upload.com)",
			linkType: "embed",
			experimentalCustomStep: "turboBegin",
		},
	},
	"kisstvshow.to": {
		"rapidvideo": null,
		"p2p": null,
		"beta2": null,
		"nova": null,
		"mp4upload": null,
		"streamango": null,
		"beta": null, //should work, but script can't load data because of https/http session storage separation
		"rapid": {
			regex: '"https://w*?.*?rapidvid.to/e/.*?"',
			name: "RapidVideo",
			linkType: "embed",
			experimentalCustomStep: "turboBegin",
		},
		"fe": {
			regex: '"https://www.gaobook.review/v/.*?"',
			name: "FE (gaobook.review)",
			linkType: "embed",
			experimentalCustomStep: "turboBegin",
		},
		"mp": {
			regex: '"https://www.mp4upload.com/embed-.*?"',
			name: "MP (mp4upload.com)",
			linkType: "embed",
			experimentalCustomStep: "turboBegin",
		},
	},
}

KG.supportedSites = {
	"kissanime.ru": {
		contentPath: "/Anime/*",
		noCaptchaServer: "rapidvideo",
		buttonColor: "#548602",
		buttonTextColor: "#fff",
	},
	"kimcartoon.to": {
		contentPath: "/Cartoon/*",
		noCaptchaServer: "rapid",
		buttonColor: "#ecc835",
		buttonTextColor: "#000",
		optsPosition: 1,
		fixes: ["kimcartoon.to_UIFix"],
	},
	"kissasian.sh": {
		contentPath: "/Drama/*",
		noCaptchaServer: "rapid",
		buttonColor: "#F5B54B",
		buttonTextColor: "#000",
		fixes: ["kissasian.sh_UIFix"],
	},
	"kisstvshow.to": {
		contentPath: "/Show/*",
		noCaptchaServer: "rapid",
		buttonColor: "#F5B54B",
		buttonTextColor: "#000",
		fixes: ["kisstvshow.to_UIFix"],
	},
}

KG.preferences = {
	general: {
		quality_order: "1080, 720, 480, 360",
	},
	internet_download_manager: {
		idm_path: "C:\\Program Files (x86)\\Internet Download Manager\\IDMan.exe",
		arguments: "",
		keep_title_in_episode_name: false,
	},
	compatibility: {
		force_default_grabber: false,
		enable_experimental_grabbers: false,
		disable_automatic_actions: false,
	},
}


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
		var headerTitle = i.replace(/_/g, " ").replace(/[a-z]+/g, (s) => s.charAt(0).toUpperCase() + s.slice(1));
		$("#KG-preferences-container-outer").append(`<div class="KG-preferences-header KG-bigChar">${headerTitle}</div>`)
			.append($group);
	}
	KG.applyColors();
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
	$(".KG-episodelist-button, .KG-button")
		.css({ "color": site.buttonTextColor, "background-color": site.buttonColor });
	$(".KG-bigChar")
		.css("color", $(".bigChar").css("color"));
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
			if (KG.actions[i].automatic && !KG.preferences.compatibility.disable_automatic_actions && !KG.status.automaticDone) {
				KG.status.automaticDone = true;
				KG.actions[i].execute(KG.status);
			}
			if (KG.actions[i].automatic && KG.status.automaticDone) {
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

//applies regex to html to find a link
KG.findLink = (html, regexString) => {
	var re = new RegExp(regexString);
	var result = html.match(re);
	if (result && result.length > 0) {
		return result[0].split('"')[1];
	}
	return "";
}

//wildcard-enabled string comparison
KG.if = (str, rule) => {
	return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
}

//iterates over an array with supplied function
//either (array, min, max, func)
//or     (array, func)
KG.for = (array, min, max, func) => {
	if (typeof min == "function") {
		func = min;
		max = array.length - 1;
	}
	min = Math.max(0, min) || 0;
	max = Math.min(array.length - 1, max);
	for (var i = min; i <= max; i++) {
		func(i, array[i]);
	}
}

//removes characters that have special meaning in a batch file or are forbidden in directory names
KG.makeBatSafe = (str) => {
	return str.replace(/[%^&<>|:\\/?*"]/g, "_");
}

KG.timeout = (time) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, time)
	});
}

KG.get = (url) => {
	return new Promise((resolve, reject) => {
		GM_xmlhttpRequest({
			method: "GET",
			url: url,
			onload: (o) => {
				resolve(o.response);
			},
			onerror: () => {
				reject();
			}
		});
	});
}

KG.head = (url) => {
	return new Promise((resolve, reject) => {
		GM_xmlhttpRequest({
			method: "HEAD",
			url: url,
			onload: (o) => {
				resolve(o.status);
			},
			onerror: () => {
				reject();
			}
		});
	});
}

//allows multiple different approaches to collecting links, if sites differ greatly
KG.steps = {};

//default
KG.steps.defaultBegin = () => {
	KG.status.func = "defaultGetLink";
	KG.saveStatus();
	location.href = KG.status.episodes[KG.status.current].kissLink + `&s=${KG.status.server}`;
}

KG.steps.defaultGetLink = () => {
	if (!KG.if(location.pathname, KG.supportedSites[location.hostname].contentPath)) { //captcha
		return;
	}
	link = KG.findLink(document.body.innerHTML, KG.knownServers[KG.status.server].regex);
	KG.status.episodes[KG.status.current].grabLink = link || "error (selected server may not be available)";

	KG.status.current++;
	if (KG.status.current >= KG.status.episodes.length) {
		KG.status.func = "defaultFinished";
		location.href = KG.status.url;
	} else {
		location.href = KG.status.episodes[KG.status.current].kissLink + `&s=${KG.status.server}`;
	}
	KG.saveStatus();
}

KG.steps.defaultFinished = () => {
	KG.displayLinks();
}

KG.steps.turboBegin = async () => {
	$("#KG-linkdisplay").slideDown();
	KG.showSpinner();
	var progress = 0;
	var func = async (ep) => {
		var html = await KG.get(ep.kissLink + `&s=${KG.status.server}`);
		var link = KG.findLink(html, KG.knownServers[KG.status.server].regex);
		ep.grabLink = link || "error: server not available or captcha";
		progress++;
		KG.spinnerText(`${progress}/${promises.length}`)
	};
	var promises = [];
	KG.for(KG.status.episodes, (i, obj) => {
		promises.push(func(obj));
	});
	KG.spinnerText(`0/${promises.length}`)
	await Promise.all(promises);
	KG.status.func = "defaultFinished";
	KG.saveStatus();
	KG.displayLinks();
}

//allows for multiple ways to export collected data
KG.exporters = {};

KG.exporters.list = {
	name: "list",
	extension: "txt",
	requireSamePage: false,
	requireDirectLinks: false,
	export: (data) => {
		var str = "";
		for (var i in data.episodes) {
			str += data.episodes[i].grabLink + "\n";
		}
		return str;
	}
}

KG.exporters.m3u = {
	name: "m3u8 playlist",
	extension: "m3u8",
	requireSamePage: true,
	requireDirectLinks: true,
	export: (data) => {
		var listing = $(".listing a").get().reverse();
		var str = "#EXTM3U\n";
		KG.for(data.episodes, (i, obj) => {
			str += `#EXTINF:0,${listing[obj.num-1].innerText}\n${obj.grabLink}\n`;
		});
		return str;
	}
}

KG.exporters.json = {
	name: "json",
	extension: "json",
	requireSamePage: true,
	requireDirectLinks: false,
	export: (data) => {
		var listing = $(".listing a").get().reverse();
		var json = {
			title: data.title,
			server: data.server,
			linkType: data.linkType,
			episodes: []
		};
		for (var i in data.episodes) {
			json.episodes.push({
				number: data.episodes[i].num,
				name: listing[data.episodes[i].num - 1].innerText,
				link: data.episodes[i].grabLink
			});
		}
		return JSON.stringify(json);
	},
}

KG.exporters.html = {
	name: "html list",
	extension: "html",
	requireSamePage: true,
	requireDirectLinks: true,
	export: (data) => {
		var listing = $(".listing a").get().reverse();
		var str = "<html>\n	<body>\n";
		KG.for(data.episodes, (i, obj) => {
			str += `		<a href="${obj.grabLink}" download="${listing[obj.num-1].innerText}.mp4">${listing[obj.num-1].innerText}</a><br>\n`;
		});
		str += "	</body>\n</html>\n";
		return str;
	}
}

KG.exporters.csv = {
	name: "csv",
	extension: "csv",
	requireSamePage: true,
	requireDirectLinks: false,
	export: (data) => {
		var listing = $(".listing a").get().reverse();
		var str = "episode, name, url\n";
		for (var i in data.episodes) {
			str += `${data.episodes[i].num}, ${listing[data.episodes[i].num-1].innerText}, ${data.episodes[i].grabLink}\n`;
		}
		return str;
	}
}

KG.exporters.aria2c = {
	name: "aria2c file",
	extension: "txt",
	requireSamePage: false,
	requireDirectLinks: true,
	export: (data) => {
		var listing = $(".listing a").get().reverse();
		var str = "";
		KG.for(data.episodes, (i, obj) => {
			str += `${obj.grabLink}\n out=${listing[obj.num-1].innerText}.mp4\n`;
		});
		return str;
	}
}

KG.exporters.idmbat = {
	name: "IDM bat file",
	extension: "bat",
	requireSamePage: true,
	requireDirectLinks: true,
	export: (data) => {
		var listing = $(".listing a").get().reverse();
		var title = KG.makeBatSafe(data.title);
		var str = `::download and double click me!
@echo off
set title=${title}
set idm=${KG.preferences.internet_download_manager.idm_path}
set args=${KG.preferences.internet_download_manager.arguments}
set dir=%~dp0
if not exist "%idm%" echo IDM not found && echo check your IDM path in preferences && pause && goto eof
mkdir "%title%" > nul
start "" "%idm%"
ping localhost -n 2 > nul\n\n`;
		KG.for(data.episodes, (i, obj) => {
			var epTitle = KG.makeBatSafe(listing[obj.num - 1].innerText);
			if (!KG.preferences.internet_download_manager.keep_title_in_episode_name &&
				epTitle.slice(0, title.length) === title) {
				epTitle = epTitle.slice(title.length + 1);
			}
			str += `"%idm%" /n /p "%dir%\\%title%" /f "${epTitle}.mp4" /d "${obj.grabLink}" %args%\n`;
		});
		return str;
	}
}

//further options after grabbing, such as converting embed to direct links

KG.actions = {};
KG.actionAux = {};

KG.actions.rapidvideo_revertDomain = {
	name: "revert domain",
	requireLinkType: "embed",
	servers: ["rapidvideo", "rapid"],
	automatic: true,
	execute: async (data) => {
		await KG.timeout(5); //wait for currently running KG.displayLinks to finish
		for (var i in data.episodes) {
			data.episodes[i].grabLink = data.episodes[i].grabLink.replace("rapidvid.to", "rapidvideo.com")
		}
		data.automaticDone = true;
		KG.saveStatus();
		KG.displayLinks();
	},
}

KG.actions.rapidvideo_getDirect = {
	name: "get direct links",
	requireLinkType: "embed",
	servers: ["rapidvideo", "rapid"],
	execute: async (data) => {
		KG.showSpinner();
		var promises = [];
		var progress = [0];
		for (var i in data.episodes) {
			promises.push(KG.actionAux["rapidvideo_getDirect"](data.episodes[i], progress, promises));
		}
		KG.spinnerText(`0/${promises.length}`);
		await Promise.all(promises);
		data.linkType = "direct";
		KG.saveStatus();
		KG.displayLinks();
	},
}

//additional function to reduce clutter
//asynchronously gets the direct link
KG.actionAux.rapidvideo_getDirect = async (ep, progress, promises) => {
	if (ep.grabLink.slice(0, 5) == "error") {
		progress[0]++;
		KG.spinnerText(`${progress[0]}/${promises.length}`);
		return;
	}
	$html = $(await KG.get(ep.grabLink));
	$sources = $html.find("source");
	if ($sources.length == 0) {
		ep.grabLink = "error: no sources found";
		return;
	}

	var sources = {};
	KG.for($sources, (i, obj) => {
		sources[obj.dataset.res] = obj.src;
	});

	progress[0]++;
	KG.spinnerText(`${progress[0]}/${promises.length}`);

	var parsedQualityPrefs = KG.preferences.general.quality_order.replace(/\ /g, "").split(",");
	for (var i of parsedQualityPrefs) {
		if (sources[i]) {
			ep.grabLink = sources[i];
			return;
		}
	}
	ep.grabLink = "error: preferred qualities not found";
}

KG.actions.beta_setQuality = {
	name: "set quality",
	requireLinkType: "direct",
	servers: ["beta", "beta2"],
	automatic: true,
	execute: async (data) => {
		KG.showSpinner();
		var promises = [];
		var progress = [0];
		for (var i in data.episodes) {
			promises.push(KG.actionAux["beta_tryGetQuality"](data.episodes[i], progress, promises));
		}
		KG.spinnerText(`0/${promises.length}`);
		await Promise.all(promises);
		data.automaticDone = true;
		KG.saveStatus();
		KG.displayLinks();
	},
}

KG.actionAux.beta_tryGetQuality = async (ep, progress, promises) => {
	var rawLink = ep.grabLink.slice(0, -4);
	var qualityStrings = {"1080": "=m37", "720": "=m22", "360": "=m18"};
	var parsedQualityPrefs = KG.preferences.general.quality_order.replace(/\ /g, "").split(",");
	for (var i of parsedQualityPrefs) {
		if (qualityStrings[i]) {
			if (await KG.head(rawLink + qualityStrings[i]) == 200) {
				ep.grabLink = rawLink + qualityStrings[i];
				progress[0]++;
				KG.spinnerText(`${progress[0]}/${promises.length}`);
				return;
			}
		}
	}
}

//if something doesn't look right on a specific site, a fix can be written here
KG.fixes = {}

KG.fixes["kimcartoon.to_UIFix"] = () => {
	//linkdisplay
	var $ld = $("#KG-linkdisplay");
	$ld.find(".barTitle").removeClass("barTitle")
		.css({
			"height": "20px",
			"padding": "5px",
		});
	$("#KG-linkdisplay-title").css({
		"font-size": "20px",
		"color": $("a.bigChar").css("color"),
	})
	$ld.find(".arrow-general").remove();

	//preference panel
	var $pf = $("#KG-preferences");
	$pf.find(".barTitle").removeClass("barTitle")
		.css({
			"height": "20px",
			"padding": "5px",
		});
	$("#KG-linkdisplay-title").css({
		"font-size": "20px",
		"color": $("a.bigChar").css("color"),
	});
	$pf.find(".arrow-general").remove();

	//opts
	var $opts = $("#KG-opts-widget");
	var title = $opts.find(".barTitle").html();
	$opts.before(`<div class="title-list icon">${title}</div><div class="clear2"></div>`);
	$(".icon:eq(1)").css({ "width": "100%", "box-sizing": "border-box" });
	$(".KG-preferences-button").css("margin-top", "5px");
	$opts.find(".barTitle").remove();
	$opts.find(".arrow-general").remove();

	//general
	$(".KG-dialog-title").css("font-size", "18px");
}

KG.fixes["kissasian.sh_UIFix"] = () => {
	$(".KG-preferences-button").css("filter", "invert(0.7)");
	$(".KG-dialog-close").css("color", "#000");
	$(".KG-dialog-close").hover((e) => {
		$(e.target).css("color", e.type == "mouseenter" ? "#fff" : "#000");
	});
}

//HTML and CSS pasted here because Tampermonkey apparently doesn't allow resources to be updated

//the grabber widget injected into the page
var optsHTML = `<div class="rightBox" id="KG-opts-widget">
	<div class="barTitle">
		KissGrabber
		<button class="KG-preferences-button" onclick="KG.showPreferences()"></button>
	</div>
	<div class="barContent">
		<div class="arrow-general">
			&nbsp;
		</div>
		<select id="KG-input-server" onchange="KG.updatePreferredServer()" style="">
		</select>
		<p>
			from
			<input type="number" id="KG-input-from" class="KG-input-episode" value=1 min=1> to
			<input type="number" id="KG-input-to" class="KG-input-episode" min=1>
		</p>
		<div class="KG-button-container">
			<input type="button" class="KG-button" id="KG-input-start" value="Extract Links" onclick="KG.startRange($('#KG-input-from').val(),$('#KG-input-to').val())">
		</div>
	</div>
</div>
<div class="clear2">
</div>`;

//initially hidden HTML that is revealed and filled in by the grabber script
var linkListHTML = `<div class="bigBarContainer" id="KG-linkdisplay" style="display: none;">
	<div class="barTitle">
		<div class="KG-dialog-title">
			Extracted Links
		</div>
		<a class="KG-dialog-close" onclick="KG.closeLinkdisplay()">
			close &nbsp;
		</a>
	</div>
	<div class="barContent">
		<div class="arrow-general">
			&nbsp;</div>
		<div id="KG-linkdisplay-text"></div>
		<div class="KG-button-container" id="KG-action-container">
			<select id="KG-input-export" onchange="KG.exportData(this.value)">
				<option value="" selected disabled hidden>Export as</option>
			</select>
		</div>
		<div id="KG-linkdisplay-export" style="display: none;">
			<textarea id="KG-linkdisplay-export-text" spellcheck="false"></textarea>
			<div class="KG-button-container">
				<a id="KG-input-export-download">
					<input type="button" value="Download" class="KG-button" style="float: right;">
				</a>
			</div>
		</div>
	</div>
</div>`;

//initially hidden HTML that is revealed and filled in by the grabber script
var prefsHTML = `<div class="bigBarContainer" id="KG-preferences" style="display: none;">
	<div class="barTitle">
		<div class="KG-dialog-title">
			Preferences
			<a class="KG-preferences-help-button" href="https://github.com/thorio/KGrabber/wiki/Preferences" target="blank">?</a>
		</div>
		<a class="KG-dialog-close" onclick="KG.closePreferences()">
			save &nbsp;
		</a>
	</div>
	<div class="barContent">
		<div class="arrow-general">
			&nbsp;</div>
		<div id="KG-preferences-container-outer">
		</div>
		<div class="KG-button-container">
			<input type="button" value="Reset to Defaults" class="KG-button" style="float: right;" onclick="KG.resetPreferences()">
		</div>
	</div>
</div>`;

//css to make it all look good
var grabberCSS = `.KG-episodelist-header {
	width: 3%;
	text-align: center !important;
}

.KG-episodelist-number {
	text-align: right;
	padding-right: 4px;
}

.KG-episodelist-button {
	background-color: #527701;
	color: #ffffff;
	border: none;
	cursor: pointer;
}

.KG-input-episode {
	width: 40px;
	border: 1px solid #666666;
	background: #393939;
	padding: 3px;
	color: #ffffff;
}

.KG-input-text {
	width: 150px;
	border: 1px solid #666666;
	background: #393939;
	padding: 3px;
	margin-left: 5px;
	color: #ffffff;
}

.KG-input-checkbox {
	height: 22px;
}

#KG-input-server {
	width: 100%;
	font-size: 14.5px;
	color: #fff;
}

#KG-input-export {
	margin: 6px;
	float: left;
	color: #fff;
}

.KG-button {
	background-color: #548602;
	color: #ffffff;
	border: none;
	padding: 5px;
	padding-left: 12px;
	padding-right: 12px;
	font-size: 15px;
	margin: 3px;
	float: left;
}

.KG-button-container {
	margin-top: 10px;
	height: 34px;
}

.KG-dialog-title {
	width: 80%;
	float: left;
}

.KG-bigChar {
	margin: 0px;
	padding: 0px;
	font: normal 27px "Tahoma" , Arial, Helvetica, sans-serif;
	letter-spacing: -2px;
}

#KG-linkdisplay-text {
	word-break: break-all;
}

.KG-linkdisplay-row {
	display: flex;
	flex-direction: row;
}

.KG-linkdisplay-episodenumber {
	min-width: 30px;
	text-align: right;
	user-select: none;
	margin-right: 5px;
}

#KG-linkdisplay-export {
	margin-top: 10px;
}

#KG-linkdisplay-export-text {
	width: 100%;
	height: 150px;
	min-height: 40px;
	resize: vertical;
	background-color: #222;
	color: #fff;
	border: none;
}

.KG-dialog-close {
	float: right;
	cursor: pointer;
	font-size: 17px;
}

.KG-dialog-close:hover {
	color: #eee;
}

#KG-preferences-container-outer {
	overflow: auto;
}

.KG-preferences-header {
	font-size: 17px;
	letter-spacing: 0px;
	width: 100%;
	margin: 10px 0 5px 0;
}

#KG-preferences-container {
	overflow: auto;
}


#KG-preferences-container div {
	box-sizing: border-box;
	height: 26px;
	width: 50%;
	padding: 0 5px;
	margin: 2px 0;
	float: left;
	line-height: 26px;
	font-size: 14px;
}

#KG-preferences-container div span {
	padding-top: 5px;
}

.KG-preferences-button {
	width: 18px;
	height: 18px;
	margin: 3px;
	float: right;
	border: none;
	background-color: #0000;
	opacity: 0.7;
	background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAC4jAAAuIwF4pT92AAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTA1LTMxVDE0OjQ5OjI5KzAyOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wNS0zMVQxNToxMzozNCswMjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOS0wNS0zMVQxNToxMzozNCswMjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpkYTg5NGI2Mi1lOWEwLTg2NGYtYTg0Mi1lM2JkOTY3ZWI4ZTgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ZGE4OTRiNjItZTlhMC04NjRmLWE4NDItZTNiZDk2N2ViOGU4IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZGE4OTRiNjItZTlhMC04NjRmLWE4NDItZTNiZDk2N2ViOGU4Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpkYTg5NGI2Mi1lOWEwLTg2NGYtYTg0Mi1lM2JkOTY3ZWI4ZTgiIHN0RXZ0OndoZW49IjIwMTktMDUtMzFUMTQ6NDk6MjkrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7gRsl1AAAB4klEQVRIia2WO2tUQRiGn91EIUJQCzGFREwX0MUbKBaBSBRNYSGCLFY2goXgpVH8KbYighArsRDWSrAJBizSJBgtRFQMJlrENXkszi7OTuacHSUvDJzzXd75LjPfOahkrAl1WV0J1uUc3zp5OA3sAoaDNZnjmNqgCcwAewLZjoTd7uB5CHgK3NtkFaXU9C++qcfUo+qCm/FZnVIb6odAfjvkDMmvJkj+Fze7vDW1m8wb4HBOXTNRBwx7cAH4sUXk54Ei8qgHp9R2Rerr6lqf8ty34piuALVERKvADWC0sy4B8yXRfwlfauo4MAE0gIvASIL8CLAYyQeA18DxRJAPgFlgjoyUr1l+Uw/18W3X1I2SsnRxAFiq0H8C9pboNupAu8IZYL2Pvsp/rQ5s70NwokK3H9hXoR+qqVPAGYpSnAV2RkbvgYOk78gzYDqS/QZawDvgVdy0k+qvRLMW1XPqYMeuob4oaeytkHMw2n2hE8G2SD4GPAc+dvSjFWX52vMW7Dagvu1z7HKwqo6bmKYPt4C8i7ZFwD2jolWR9r/iCSXD7koUyR2Lb+9SIsqf6nV1Uv0eyB+HnKnr31Tn1elAdjexQSvQj6hz6qOYL+ePAot5FGMmxzc+pmWYBZahx/5ljuMfM3Ph5QSIQroAAAAASUVORK5CYII=");
	background-size: cover;
	cursor: pointer;
}

.KG-preferences-button:hover {
	opacity: 1;
}

.KG-preferences-help-button {
	position: absolute;
	font-size: 20px;
	margin-left: 10px;
}

.KG-preferences-help-button:hover {
	color: #fff;
}

.right {
	float: right;
}

#KG-spinner-text {
	width: 100%;
	text-align: center;
	margin-top: -40px;
	margin-bottom: 40px;
	min-height: 20px;
}

/*
	https://projects.lukehaas.me/css-loaders/
*/
.loader,
.loader:after {
	border-radius: 50%;
	width: 10em;
	height: 10em;
}

.loader {
	margin: 0px auto;
	font-size: 5px;
	position: relative;
	text-indent: -9999em;
	border-top: 1.1em solid rgba(255, 255, 255, 0.2);
	border-right: 1.1em solid rgba(255, 255, 255, 0.2);
	border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);
	border-left: 1.1em solid #ffffff;
	-webkit-transform: translateZ(0);
	-ms-transform: translateZ(0);
	transform: translateZ(0);
	-webkit-animation: load8 1.1s infinite linear;
	animation: load8 1.1s infinite linear;
}

@-webkit-keyframes load8 {
	0% {
		-webkit-transform: rotate(0deg);
		transform: rotate(0deg);
	}

	100% {
		-webkit-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}

@keyframes load8 {
	0% {
		-webkit-transform: rotate(0deg);
		transform: rotate(0deg);
	}

	100% {
		-webkit-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}`;

KG.siteLoad();