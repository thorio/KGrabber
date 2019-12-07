module.exports = class Episode {
	/**
	 * Creates a new Episode
	 * @param {Number} episodeNumber
	 * @param {String} href
	 */
	constructor(episodeNumber, href) {
		this.kissLink = href;
		this.grabbedLink = "";
		// this.processedLink = ""; //TODO implement these
		// this.error = "";
		this.episodeNumber = episodeNumber;
		Object.seal(this);
	}

	get link() {
		return this.processedLink || this.grabbedLink;
	}

	get display() {
		return this.error || this.processedLink || this.grabbedLink;
	}
};
