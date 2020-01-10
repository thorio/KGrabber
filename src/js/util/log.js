let logCss = "background-color: #456304; padding: 0 5px; border-radius: 3px; color: #fff;";

exports.info = (...obj) => {
	console.info("%cKissGrabber", logCss, ...obj);
};

exports.log = (...obj) => {
	console.log("%cKissGrabber", logCss, ...obj);
};

exports.warn = (...obj) => {
	console.warn("%cKissGrabber", logCss, ...obj);
};

exports.err = (...obj) => {
	console.error("%cKissGrabber", logCss, ...obj);
};

exports.debug = (...obj) => {
	console.debug("%cKissGrabber", logCss, ...obj);
};
