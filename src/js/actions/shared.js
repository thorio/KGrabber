exports.eachEpisode = (status, func, setSpinnerText) => {
	let promises = [];
	let progress = 0;
	for (let i in status.episodes) {
		promises.push(func(status.episodes[i]).then(() => {
			progress++;
			setSpinnerText(`${progress}/${promises.length}`);
		}));
	}
	setSpinnerText(`0/${promises.length}`);
	return Promise.all(promises); // TODO add generic error handler
};
