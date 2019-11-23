module.exports = class Episode {

	/**
	 * Creates a new Episode
	 * @param {Number} episodeNumber
	 * @param {String} href
	 */
	constructor(episodeNumber, href) {
		this.kissLink = href;
		this.grabLink = ""; //TODO rename to grabbedLink
		// this.processedLink = ""; //TODO implement these
		// this.error = "";
		this.num = episodeNumber; //TODO rename to episodeNumber
	}

	get link() {
		return this.processedLink || this.grabLink;
	}

	get display() {
		return this.error || this.processedLink || this.grabLink;
	}
};
