//entry function
KG.siteLoad = () => {
	if (!KG.supportedSites[location.hostname]) {
		console.warn("KG: site not supported");
		return;
	}

	KG.applyServerOverrides();
	
	if (KG.if(location.pathname, KG.supportedSites[location.hostname].contentPath) && $(".bigBarContainer .bigChar").length != 0) {
		KG.injectWidgets();
	}

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

//patches the knownServers object based on the current url
KG.applyServerOverrides = () => {
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

	//box on the right
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

	//links in the middle
	$("#leftside").prepend(linkListHTML);

	//numbers and buttons on each episode
	$(".listing tr:eq(0)").prepend(`<th class="KG-episodelist-header">#</th>`);
	$(".listing tr:gt(1)").each((i, obj) => {
		$(obj).prepend(`<td class="KG-episodelist-number">${epCount-i}</td>`)
			.children(":eq(1)").prepend(`<input type="button" value="grab" class="KG-episodelist-button" onclick="KG.startSingle(${epCount-i})">&nbsp;`);
	});

	//colors
	$(".KG-episodelist-button").add(".KG-button")
		.css({ color: site.buttonTextColor, "background-color": site.buttonColor });

	//fixes
	for (var i in site.fixes) {
		if (KG.fixes[site.fixes[i]]) {
			KG.fixes[site.fixes[i]]();
		} else {
			console.error(`KG: nonexistant fix "${site.fixes[i]}"`);
		}
	}
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
		title: $(".bigBarContainer .bigChar").text(),
		server: $("#KG-input-server").val(),
		episodes: [],
		start: start,
		current: 0,
		func: "defaultBegin",
	}
	var epCount = $(".listing a").length;
	KG.for($(`.listing a`).get().reverse(), start - 1, end - 1, (i, obj) => {
		KG.status.episodes.push({
			kissLink: obj.href,
			grabLink: "",
			num: i + 1,
		});
	});
	KG.saveStatus();
	KG.steps[KG.status.func]();
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
	$("#KG-linkdisplay-title").text(`Extracted Links | ${KG.status.title}`);

	var onSamePage = KG.status.url == location.href;
	for (var i in KG.exporters) {
		var disable = KG.exporters[i].requireSamePage && !onSamePage;
		var disabled = disable ? "disabled" : "";
		$("#KG-input-export").append(`<option value="${i}" ${disabled}>${KG.exporters[i].name}</option>`);
	}

	$("#KG-linkdisplay").show();
}

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

//hides the linkdisplay
KG.closeLinkdisplay = () => {
	$("#KG-linkdisplay").hide();
	KG.clearStatus();
}

//saves a new preferred server
KG.updatePreferredServer = () => {
	localStorage["KG-preferredServer"] = $("#KG-input-server").val();
}

KG.loadPreferredServer = () => {
	$("#KG-input-server").val(localStorage["KG-preferredServer"]);
}