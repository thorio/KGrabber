/**
 * Enumerates the possible link types
 * @readonly
 * @enum {String}
 */
module.exports = Object.freeze({
	/**
	 * Points to a website with player
	 * Not directly downloadable
	 */
	EMBED: "embed",
	/**
	 * Points directly to the video file
	 * Easily downloaded
	 */
	DIRECT: "direct",
});
