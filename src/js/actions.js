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