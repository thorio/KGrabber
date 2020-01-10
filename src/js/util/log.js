let logCss = "background-color: #456304; padding: 0 5px; border-radius: 3px; color: #fff;";
let prefix = "KGrabber";

exports.info = (...obj) => {
	console.info(`%c${prefix}`, logCss, ...obj);
};

exports.log = (...obj) => {
	console.log(`%c${prefix}`, logCss, ...obj);
};

exports.warn = (...obj) => {
	console.warn(`%c${prefix}`, logCss, ...obj);
};

exports.err = (...obj) => {
	console.error(`%c${prefix}`, logCss, ...obj);
};

exports.debug = (...obj) => {
	console.debug(`%c${prefix}`, logCss, ...obj);
};
