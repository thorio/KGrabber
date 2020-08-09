/**
 * @typedef {import("kgrabber-types/Status")} Status
 */

const util = require("../util"),
	{ LinkTypes, Exporter } = require("kgrabber-types"),
	{ preferenceManager } = require("../config/"),
	shared = require("./shared");

const EXTENSION = ".mp4";

const preferences = preferenceManager.get();

module.exports = new Exporter({
	name: "IDM bat file",
	extension: "bat",
	requireSamePage: true,
	linkTypes: [LinkTypes.DIRECT],
}, runExport);

/**
 * @param {Status} status
 * @returns {String}
 */
function runExport(status) {
	let listing = $(".listing a").get().reverse();
	let title = util.replaceSpecialCharacters(status.title);
	let str = getHeader(title);
	for (let episode of status.episodes) {
		if (!episode.error) {
			let { dir, filename } = shared.getDirAndFilename(status, episode, "%~dp0", EXTENSION, listing);
			str += `"%idm%" /n /p "${dir}" /f "${filename}" /d "${episode.functionalLink}" %args%\n`;
		}
	}
	return str;
}

/**
 * @param {string} title
 * @param {string} dir
 * @returns {string}
 */
function getHeader() {
	return `::download and double click me!
@echo off
set idm=${preferences.internet_download_manager.idm_path}
set args=${preferences.internet_download_manager.arguments}
if not exist "%idm%" echo IDM not found && echo check your IDM path in preferences && pause && goto eof
start "" "%idm%"
ping localhost -n 2 > nul\n\n`;
}
