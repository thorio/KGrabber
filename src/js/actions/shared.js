const linkDisplay = require("../UI/linkDisplay"); //resolve circular dependency

exports.eachEpisode = (status, func) => {
	linkDisplay.showSpinner();
	let promises = [];
	let progress = 0;
	for (let i in status.episodes) {
		promises.push(func(status.episodes[i]).then(() => {
			progress++;
			linkDisplay.setSpinnerText(`${progress}/${promises.length}`);
		}));
	}
	linkDisplay.setSpinnerText(`0/${promises.length}`);
	return Promise.all(promises); // TODO add generic error handler
};
