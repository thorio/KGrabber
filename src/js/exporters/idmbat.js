// needed for jsdoc
/* eslint-disable no-unused-vars */
const Status = require("../types/Status");
/* eslint-enable no-unused-vars */

const LinkTypes = require("../types/LinkTypes"),
	util = require("../util"),
	preferenceManager = require("../config/preferenceManager"),
	Exporter = require("../types/Exporter");

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
	let title = util.makeBatSafe(status.title);
	let str = getHeader(title);
	for (let episode of status.episodes) {
		let epTitle = util.makeBatSafe(listing[episode.episodeNumber - 1].innerText);
		if (!preferences.internet_download_manager.keep_title_in_episode_name &&
			epTitle.slice(0, title.length) === title) {
			epTitle = epTitle.slice(title.length + 1);
		}
		str += `"%idm%" /n /p "%dir%\\%title%" /f "${epTitle}.mp4" /d "${episode.grabbedLink}" %args%\n`;
	}
	return str;
}

/**
 * @param {String} title
 * @returns {String}
 */
function getHeader(title) {
	return `::download and double click me!
@echo off
set title=${title}
set idm=${preferences.internet_download_manager.idm_path}
set args=${preferences.internet_download_manager.arguments}
set dir=${preferences.internet_download_manager.download_path}
if not exist "%idm%" echo IDM not found && echo check your IDM path in preferences && pause && goto eof
mkdir "%title%" > nul
start "" "%idm%"
ping localhost -n 2 > nul\n\n`;
}
