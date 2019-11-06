const shared = require("./shared"),
	exporters = require("../exporters"),
	util = require("../util"),
	html = require("../html"),
	actions = require("../actions"),
	statusManager = require("../statusManager");

const status = statusManager.get();

exports.inject = async () => {
	$("#leftside").prepend(html.linkDisplay);
	setHandlers();
	if (!$("#KG-linkdisplay").length) util.log.err(new Error("linkDisplay not injected"));
};

let load = exports.load = (status) => {
	setTitle(`Extracted Links | ${status.title}`);
	loadLinks(status.episodes);
	loadExporters();
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
	let padLength = Math.max(2, $(".listing a").length.toString().length);
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
		if (actions[i].automatic) { //schedule automatic actions
			util.defer(() => {
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

function loadExporters() {
	let onSamePage = status.url == location.href;
	let $exporters = $("#KG-input-export");
	$exporters.empty() //clear old exporters
		.append(`<option value="" selected disabled hidden>Export as</option>`); //add label
	for (let i in exporters) { //add each exporter
		let $exporter = $(`<option value="${i}">${exporters[i].name}</option>`).appendTo($exporters);
		if ((exporters[i].requireSamePage && !onSamePage) ||
			(exporters[i].requireDirectLinks && status.linkType != "direct")
		) {
			$exporter.attr("disabled", true);
		}
	}
}

function setHandlers() {
	$("#KG-linkdisplay .KG-dialog-close").click(() => {
		hide();
		statusManager.clear();
	});
	$("#KG-input-export").change((e) => {
		runExporter(e.currentTarget.value);
		$("#KG-input-export").val(""); //reset display to label
	});
}

async function executeAction(action) {
	showSpinner();
	await action.execute(status, setSpinnerText);
	statusManager.save();
	load(status);
}

function runExporter(name) {
	let exporter = exporters[name];
	let data = exporter.export(status);
	setExportText(data);
	setDownloadFile(data, status.title, exporter.extension);
	showExports();
}

let showSpinner = () =>
	$("#KG-linkdisplay-text").html(`<div class="loader">Loading...</div><div id="KG-spinner-text"><div>`);

let setSpinnerText = (str) =>
	$("#KG-spinner-text").text(str);

function setExportText(text) {
	$("#KG-linkdisplay-export-text").text(text);
}

function showExports() {
	$("#KG-linkdisplay-export").show();
}

function setDownloadFile(data, filename, extension) {
	$("#KG-input-export-download").attr({
		href: `data:text/plain;charset=utf-8,${encodeURIComponent(data)}`,
		download: `${filename}.${extension}`,
	});
}
