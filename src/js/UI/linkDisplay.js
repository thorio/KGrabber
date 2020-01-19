/**
 * @typedef {import("../types/Episode")} Episode
 */

const shared = require("./shared"),
	exporters = require("../exporters"),
	util = require("../util"),
	html = require("../html"),
	actions = require("../actions"),
	statusManager = require("../statusManager"),
	page = require("./page"),
	{ sites } = require("../config");

const status = statusManager.get();
let injected = false;

function inject() {
	$("#leftside").prepend(html.linkDisplay);
	setHandlers();
	sites.current().applyPatch("linkDisplay");
	injected = true;
	if (!$("#KG-linkdisplay").length) util.log.err(new Error("linkDisplay not injected"));
}

let load = exports.load = () => {
	show(true);
	setTitle(`Extracted Links | ${status.title}`);
	loadLinks(status.episodes);
	loadExporters(exporters.sorted(status.linkType, status.url == page.href));
	loadActions(actions.available());

	shared.applyColors();
};

/**
 * @param {Boolean} instant
 */
let show = exports.show = (instant) => {
	if (!injected) inject();
	instant ? $("#KG-linkdisplay").show() : $("#KG-linkdisplay").slideDown();
};

let hide = exports.hide = () =>
	$("#KG-linkdisplay").slideUp();

function setTitle(text) {
	$("#KG-linkdisplay .KG-dialog-title").text(text);
}

// TODO convert to html table
// TODO add metadata display
/**
 * @param {Episode[]} episodes
 */
function loadLinks(episodes) {
	let html = "";
	let padLength = Math.max(2, page.episodeCount().toString().length);
	util.for(episodes, (i, /** @type {Episode} */ obj) => {
		let num = obj.episodeNumber.toString().padStart(padLength, "0");
		let number = `<div class="KG-linkdisplay-episodenumber">E${num}:</div>`;
		let link = `<a href="${obj.functionalLink}" target="_blank">${obj.displayLink}</a>`;
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
	let $exporters = $("#KG-linkdisplay-export-dropdown");
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
	await actions.execute(action, setSpinnerText);
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
	$("#KG-linkdisplay-text").html(`<div class="loader">Loading...</div><div id="KG-loader-text"><div>`);

let setSpinnerText = exports.setSpinnerText = (str) =>
	$("#KG-loader-text").text(str);

let setExportText = (text) =>
	$("#KG-linkdisplay-export-text").text(text);

let showExports = () =>
	$("#KG-linkdisplay-export").show();

function setDownloadFile(data, filename, extension) {
	$("#KG-linkdisplay-export-download").attr({
		href: `data:text/plain;charset=utf-8,${encodeURIComponent(data)}`,
		download: `${filename}.${extension}`,
	});
}
