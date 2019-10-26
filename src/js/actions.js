//further options after grabbing, such as converting embed to direct links

KG.actions = {};
KG.actionAux = {};

//#region RapidVideo
KG.actions.rapidvideo_revertDomain = {
	name: "revert domain",
	requireLinkType: "embed",
	servers: ["rapid"],
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
	servers: ["rapid"],
	execute: async (data) => {
		KG.actionAux.generic_eachEpisode(data, KG.actionAux.rapidvideo_getDirect, () => {
			data.linkType = "direct";
		});
	},
}

//additional function to reduce clutter
//asynchronously gets the direct link
KG.actionAux.rapidvideo_getDirect = async (ep) => {
	if (ep.grabLink.slice(0, 5) == "error") {
		return;
	}
	var response = await KG.get(ep.grabLink);
	if (response.status != 200) {
		ep.grabLink = `error: http status ${response.status}`;
		return;
	}
	var $html = $(response.response);
	var $sources = $html.find("source");
	if ($sources.length == 0) {
		ep.grabLink = "error: no sources found";
		return;
	}

	var sources = {};
	KG.for($sources, (i, obj) => {
		sources[obj.dataset.res] = obj.src;
	});

	var parsedQualityPrefs = KG.preferences.general.quality_order.replace(/\ /g, "").split(",");
	for (var i of parsedQualityPrefs) {
		if (sources[i]) {
			ep.grabLink = sources[i];
			return;
		}
	}
	ep.grabLink = "error: preferred qualities not found";
}
//#endregion

//#region Beta
KG.actions.beta_setQuality = {
	name: "set quality",
	requireLinkType: "direct",
	servers: ["beta2"],
	automatic: true,
	execute: async (data) => {
		KG.actionAux.generic_eachEpisode(data, KG.actionAux.beta_tryGetQuality, () => {
			data.automaticDone = true;
		});
	},
}

KG.actionAux.beta_tryGetQuality = async (ep) => {
	if (!ep.grabLink.match(/.*=m\d\d/)) { //invalid link
		KG.logwarn(`invalid beta link "${ep.grabLink}"`);
		return;
	}
	var rawLink = ep.grabLink.slice(0, -4);
	var qualityStrings = { "1080": "=m37", "720": "=m22", "360": "=m18" };
	var parsedQualityPrefs = KG.preferences.general.quality_order.replace(/\ /g, "").split(",");
	for (var i of parsedQualityPrefs) {
		if (qualityStrings[i]) {
			if (await KG.head(rawLink + qualityStrings[i]).status == 200) {
				ep.grabLink = rawLink + qualityStrings[i];
				return;
			}
		}
	}
}
//#endregion

//#region Nova
KG.actions.nova_getDirect = {
	name: "get direct links",
	requireLinkType: "embed",
	servers: ["nova", "rapidvideo"],
	execute: async (data) => {
		KG.actionAux.generic_eachEpisode(data, KG.actionAux.nova_getDirect, () => {
			data.linkType = "direct";
		});
	},
}

//additional function to reduce clutter
//asynchronously gets the direct link
KG.actionAux.nova_getDirect = async (ep) => {
	if (ep.grabLink.slice(0, 5) == "error") {
		return;
	}
	var response = await KG.post(`https://www.novelplanet.me/api/source/${ep.grabLink.match(/\/([^\/]*?)$/)[1]}`);
	var json = JSON.parse(response.response);
	if (!json.data || json.data.length < 1) {
		ep.grabLink = "error: no sources found";
		return;
	}
	var sources = json.data;

	var parsedQualityPrefs = KG.preferences.general.quality_order.replace(/\ /g, "").split(",");
	for (var i of parsedQualityPrefs) {
		for (var j of sources) {
			if (j.label == i + "p") {
				ep.grabLink = j.file;
				return;
			}
		}
	}
	ep.grabLink = "error: preferred qualities not found";
}
//#endregion

//#region Generic
KG.actionAux.generic_eachEpisode = async (data, func, fin) => {
	KG.showSpinner();
	var promises = [];
	var progress = 0;
	for (var i in data.episodes) {
		promises.push(func(data.episodes[i]).then(() => {
			progress++;
			KG.spinnerText(`${progress}/${promises.length}`);
		}));
	}
	KG.spinnerText(`0/${promises.length}`);
	await Promise.all(promises);
	fin();
	KG.saveStatus();
	KG.displayLinks();
}
//#endregion
