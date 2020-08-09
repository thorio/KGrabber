/**
 * @typedef {import("kgrabber-types/Episode")} Episode
 * @typedef {import("kgrabber-types/Status")} Status
 */

const util = require("../util"),
	{ preferenceManager } = require("../config");

exports.getDirAndFilename = (status, episode, currentDirectory, extension, listing) => {
	let showTitle = util.replaceSpecialCharacters(status.title);
	let episodeName = util.replaceSpecialCharacters(listing[episode.episodeNumber - 1].innerText)
		.replace(showTitle, "")
		.trim();

	let pathArgs = { currentDirectory, showTitle, episodeName };
	let dir = preferenceManager.getDownloadDir(pathArgs);
	let filename = preferenceManager.getDownloadFilename(pathArgs) + extension;
	return { dir, filename };
};
