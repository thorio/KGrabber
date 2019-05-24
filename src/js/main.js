//entry function
KG.siteLoad = () => {
	if (!KG.supportedSites[location.hostname]) {
		console.warn("KG: site not supported");
		return;
	}

	if (KG.if(location.pathname, KG.supportedSites[location.hostname].contentPath) && $(".bigBarContainer .bigChar").length != 0) {
		KG.getShowData();
		KG.injectWidgets();
	}
}

//extracts metadata from page
KG.getShowData = () => {
	KG.showData = {
		episodeCount: $(".listing tr").length - 2,
		showTitle: $(".bigBarContainer .bigChar").text(),
	};
}

//injects element into page
KG.injectWidgets = () => {
	var epCount = KG.showData.episodeCount;

	//css
	$(document.head).append(`<style>${grabberCSS}</style>`);

	//box on the right
	$("#rightside .clear2:eq(0)").after(optsHTML);
	$("#KG-input-to").val(epCount)
		.attr("max", epCount);
	$("#KG-input-from").attr("max", epCount);

	for (var i in KG.knownServers) {
		$(`<option value="${i}">${KG.knownServers[i].name}</>`)
			.appendTo("#KG-input-server");
	}
	KG.markAvailableServers($(".listing tr:eq(2) a").attr("href"));

	//links in the middle
	$("#leftside").prepend(linkListHTML);

	//numbers and buttons on each episode
	$(".listing tr:eq(0)").prepend(`<th class="KG-episodelist-header">#</th>`);
	$(".listing tr:gt(1)").each((i, obj) => {
		$(obj).prepend(`<td class="KG-episodelist-number">${epCount-i}</td>`)
			.children(":eq(1)").prepend(`<input type="button" value="grab" class="KG-episodelist-button" onclick="KG.grabEpisode(${epCount-i})">&nbsp;`);
	});
}

KG.markAvailableServers = async (url) => {
	var servers = []
	var html = await $.get(url + "&s=rapidvideo");
	$(html).find("#selectServer").children().each((i, obj) => {
		servers.push(obj.value.match(/s=\w+/g)[0].slice(2, Infinity));
	})
	if (servers.length == 0) {
		throw "KG: no servers found";
	}
	var $selector = $("#KG-input-server option");
	$selector.each((i, obj) => {
		if (servers.indexOf(obj.value) < 0){
			$(obj).css("color", "#888");
		}
	});
}

//gets link for single episode
KG.grabEpisode = (num) => {
	alert("not implemented");
}

//hides the linkdisplay
KG.closeLinkdisplay = () => {
	$("#KG-linkdisplay").hide();
}