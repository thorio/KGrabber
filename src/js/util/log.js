let logCss = "background-color: #456304; padding: 0 5px; border-radius: 3px; color: #fff;";

exports.loginfo = (...obj) => {
	console.info("%cKissGrabber", logCss, ...obj);
};

exports.log = (...obj) => {
	console.log("%cKissGrabber", logCss, ...obj);
};

exports.logwarn = (...obj) => {
	console.warn("%cKissGrabber", logCss, ...obj);
};

exports.logerr = (...obj) => {
	console.error("%cKissGrabber", logCss, ...obj);
};
