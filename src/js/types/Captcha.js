/**
 * Represents a captcha prompt
 * @class Captcha
 */
module.exports = class Captcha {
	/**
	 * @param {String[]} texts desription of the correct images
	 * @param {String[]} images links to the images
	 */
	constructor(texts, images) {
		this.texts = texts;
		this.images = images;
		Object.seal(this);
	}
};
