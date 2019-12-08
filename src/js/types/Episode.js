module.exports = class Episode {
	/**
	 * Creates a new Episode
	 * @param {Number} episodeNumber
	 * @param {String} kissLink
	 */
	constructor(episodeNumber, kissLink) {
		this.kissLink = kissLink;
		this.grabbedLink = "";
		this.processedLink = "";
		this.error = "";
		this.episodeNumber = episodeNumber;
		Object.seal(this);
	}

	get functionalLink() {
		return this.processedLink || this.grabbedLink;
	}

	get displayLink() {
		return this.error ?
			`error: ${this.error}` :
			this.processedLink || this.grabbedLink;
	}
};
