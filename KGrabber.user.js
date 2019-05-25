// ==UserScript==
// @name					KissGrabber
// @namespace			thorou.tk
// @version				2.0~beta1
// @description		gets embed links from kissanime.ru
// @author				Thorou
// @homepageURL		https://github.com/thorio/kaGrabber/
// @updateURL			https://github.com/thorio/kaGrabber/raw/master/kaGrabber.user.js
// @downloadURL		https://github.com/thorio/kaGrabber/raw/master/kaGrabber.user.js
// @match					https://kissanime.ru/*
// @noframes
// ==/UserScript==
//
//Copyright 2018 Leon Timm
//
//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

window.KG = {};

KG.knownServers = {
	"rapidvideo": {
		regex: '"https://www.rapidvideo.com/e/.*?"',
		name: "RapidVideo (no captcha)",
	},
	"nova": {
		regex: '"https://www.novelplanet.me/v/.*?"',
		name: "Nova Server",
	},
	"beta2": {
		regex: '"https://lh3.googleusercontent.com/.*?"',
		name: "Beta2 Server",
	},
	"p2p": {
		regex: '"https://p2p2.replay.watch/public/dist/index.html\\\\?id=.*?"',
		name: "P2P Server",
	},
	"openload": {
		regex: '"https://openload.co/embed/.*?"',
		name: "Openload",
	},
	"mp4upload": {
		regex: '"https://www.mp4upload.com/embed-.*?"',
		name: "Mp4Upload",
	},
	"streamango": {
		regex: '"https://streamango.com/embed/.*?"',
		name: "Streamango",
	},
	"beta": {
		regex: '"https://lh3.googleusercontent.com/.*?"',
		name: "Beta Server",
	},
}

KG.supportedSites = {
	"kissanime.ru": {
		contentPath: "/Anime/*",
		buttonColor: "#548602",
		buttonTextColor: "#fff",
	},
	"kimcartoon.to": {
		contentPath: "/Cartoon/*",
		buttonColor: "#ecc835",
		buttonTextColor: "#000",
		optsPosition: 1,
	},
	"kissasian.sh": {
		contentPath: "/Drama/*",
		buttonColor: "#F5B54B",
		buttonTextColor: "#000",
	},
}

//applies regex to html page to find a link
KG.findLink = (regexString) => {
	var re = new RegExp(regexString);
	return document.body.innerHTML.match(re)[0]
		.split('"')[1];
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

//entry function
KG.siteLoad = () => {
	if (!KG.supportedSites[location.hostname]) {
		console.warn("KG: site not supported");
		return;
	}

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
	KG.markAvailableServers($(".listing tr:eq(2) a").attr("href"));
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
}

//grays out servers that aren't available on the url
KG.markAvailableServers = async (url) => {
	var servers = []
	var html = await $.get(url + "&s=rapidvideo");
	$(html).find("#selectServer").children().each((i, obj) => {
		servers.push(obj.value.match(/s=\w+/g)[0].slice(2, Infinity));
	})
	if (servers.length == 0) {
		throw "KG: no servers found";
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
		func: "defaultGetLink",
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
	location.href = KG.status.episodes[KG.status.current].kissLink + `&s=${KG.status.server}`;
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
	$("#KG-linkdisplay").show();
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

//allows multiple different approaches to collecting links, if sites differ greatly
KG.steps = {};

//default
KG.steps.defaultGetLink = () => {
	if (!KG.if(location.pathname, KG.supportedSites[location.hostname].contentPath)) { //captcha
		return;
	}
	link = KG.findLink(KG.knownServers[KG.status.server].regex);
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

//HTML and CSS pasted here because Tampermonkey apparently doesn't allow resources to be updated
//if you have a solution for including extra files that are updated when the script is reinstalled please let me know: thorio.git@gmail.com

//the grabber widget injected into the page
var optsHTML = `<div class="rightBox" id="KG-opts-widget">
	<div class="barTitle">
		Batch Grabber
	</div>
	<div class="barContent">
		<div class="arrow-general">
			&nbsp;
		</div>
		<select id="KG-input-server" onchange="KG.updatePreferredServer()" style="">
		</select>
		<p>
			from
			<input type="number" id="KG-input-from" class="KG-episode-input" value=1 min=1> to
			<input type="number" id="KG-input-to" class="KG-episode-input" min=1>
		</p>
		<p>
			<div class="KG-button-container">
				<input type="button" class="KG-button" value="Extract Links" onclick="KG.startRange($('#KG-input-from').val(),$('#KG-input-to').val())">
			</div>
		</p>
	</div>
</div>
<div class="clear2">
</div>`;

//initially hidden HTML that is revealed and filled in by the grabber script
var linkListHTML = `<div class="bigBarContainer" id="KG-linkdisplay" style="display: none;">
	<div class="barTitle">
		<div id="KG-linkdisplay-title">
			Extracted Links
		</div>
		<a id="KG-linkdisplay-close" onclick="KG.closeLinkdisplay()">
			close &nbsp;
		</a>
	</div>
	<div class="barContent">
		<div class="arrow-general">
			&nbsp;</div>
		<div id="KG-linkdisplay-text"></div>
		<div class="KG-button-container">
			<input id="KG-button-exportjson" class="KG-button" type="button" value="Export JSON" onclick="alert(1)" style="display: none;">
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

.KG-episode-input {
	width: 40px;
	border: 1px solid #666666;
	background: #393939;
	padding: 3px;
	color: #ffffff;
}

#KG-input-server {
	width: 100%;
	font-size: 14.5px;
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
	height: 34px;
}

#KG-linkdisplay-title {
	width: 80%;
	float: left;
}

#KG-linkdisplay-text {
	word-break: break-all;
}

.KG-linkdisplay-row {
	display: flex;
	flex-direction: row;
}

.KG-linkdisplay-episodenumber {
	width: 30px;
	text-align: right;
	user-select: none;
	margin-right: 5px;
}

#KG-linkdisplay-close {
	float: right;
	cursor: pointer;
}`;

KG.siteLoad();