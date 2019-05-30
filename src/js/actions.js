//further options after grabbing, such as converting embed to direct links
KG.actions = {
	"rapidvideo_getDirect": {
		name: "get direct links",
		requireLinkType: "embed",
		servers: ["rapidvideo", "rapid"],
		execute: async (data) => {
			KG.showSpinner();
			var promises = [];
			for (var i in data.episodes) {
				promises.push(KG["rapidvideo_getDirect"](data.episodes[i]));
			}
			await Promise.all(promises);
			data.linkType = "direct";
			KG.saveStatus();
			KG.displayLinks();
		},
	},
}

//additional function to reduce clutter
//asynchronously gets the direct link
KG["rapidvideo_getDirect"] = async (ep) => {
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

	parsedQualityPrefs = KG.preferences.quality.replace(/\ /g, "").split(",");
	for (var i of parsedQualityPrefs) {
		if (sources[i]) {
			ep.grabLink = sources[i];
			return;
		}
	}
	ep.grabLink = "error: preferred qualities not found";
}