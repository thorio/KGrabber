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