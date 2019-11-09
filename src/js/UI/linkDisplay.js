const shared = require("./shared"),
	exporters = require("../exporters"),
	util = require("../util"),
	html = require("../html"),
	actions = require("../actions"),
	statusManager = require("../statusManager"),
	page = require("./page");

const status = statusManager.get();

exports.inject = async () => {
	$("#leftside").prepend(html.linkDisplay);
	setHandlers();
	if (!$("#KG-linkdisplay").length) util.log.err(new Error("linkDisplay not injected"));
};

let load = exports.load = () => {
	setTitle(`Extracted Links | ${status.title}`);
	loadLinks(status.episodes);
	loadExporters(exporters.sorted(status.linkType, status.url == page.href));
	loadActions(actions.available(status.server, status.linkType, status.automaticDone));

	shared.applyColors();
	$("#KG-linkdisplay").show();
};

let hide = exports.hide = () =>
	$("#KG-linkdisplay").slideUp();

function setTitle(text) {
	$("#KG-linkdisplay .KG-dialog-title").text(text);
}

function loadLinks(episodes) { // TODO refactor this
	let html = "";
	let padLength = Math.max(2, page.episodeCount().toString().length);
	util.for(episodes, (i, obj) => {
		let num = obj.num.toString().padStart(padLength, "0");
		let number = `<div class="KG-linkdisplay-episodenumber">E${num}:</div>`;
		let link = `<a href="${obj.grabLink}" target="_blank">${obj.grabLink}</a>`;
		html += `<div class="KG-linkdisplay-row">${number} ${link}</div>`;
	});
	$("#KG-linkdisplay-text").html(`<div class="KG-linkdisplay-table">${html}</div>`);
}

function loadActions(actions) {
	$("#KG-action-container .KG-button").remove(); //clear old buttons
	for (let i in actions) {
		if (actions[i].automatic) {
			util.defer(() => { //schedule automatic actions
				executeAction(actions[i]);
			});
		} else {
			$(`<input type="button" class="KG-button" value="${actions[i].name}">`)
				.click(() => {
					executeAction(actions[i]);
				})
				.appendTo("#KG-action-container");
		}
	}
}

function loadExporters(arr) {
	let $exporters = $("#KG-input-export");
	$exporters.empty() //clear old exporters
		.off("change")
		.change((e) => {
			runExporter(arr[e.target.value].exporter);
			$(e.target).val(""); //reset display to label
		})
		.append($("<option>") //add label
			.attr({
				value: "",
				hidden: true,
			})
			.text("Export as")
		);

	for (let i in arr) { //add each exporter
		$("<option>")
			.text(arr[i].exporter.name)
			.attr({
				value: i,
				disabled: !arr[i].available,
			})
			.appendTo($exporters);
	}
}

function setHandlers() {
	$("#KG-linkdisplay .KG-dialog-close").click(() => {
		hide();
		statusManager.clear();
	});
}

async function executeAction(action) {
	showSpinner();
	await actions.run(action, setSpinnerText);
	statusManager.save();
	load();
}

function runExporter(exporter) {
	let data = exporter.export(status);
	setExportText(data);
	setDownloadFile(data, status.title, exporter.extension);
	showExports();
}

let showSpinner = exports.showSpinner = () =>
	$("#KG-linkdisplay-text").html(`<div class="loader">Loading...</div><div id="KG-spinner-text"><div>`);

let setSpinnerText = exports.setSpinnerText = (str) =>
	$("#KG-spinner-text").text(str);

let setExportText = (text) =>
	$("#KG-linkdisplay-export-text").text(text);

let showExports = () =>
	$("#KG-linkdisplay-export").show();

function setDownloadFile(data, filename, extension) {
	$("#KG-input-export-download").attr({
		href: `data:text/plain;charset=utf-8,${encodeURIComponent(data)}`,
		download: `${filename}.${extension}`,
	});
}
