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
	link = KG.findLink(document.body.innerHTML, KG.knownServers[location.hostname][KG.status.server].regex);
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
		var link = KG.findLink(html, KG.knownServers[location.hostname][KG.status.server].regex);
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
