exports.eachEpisode = (status, func, setProgress) => {
	let promises = [];
	let progress = 0;
	for (let i in status.episodes) {
		promises.push(func(status.episodes[i]).then(() => {
			progress++;
			setProgress(`${progress}/${promises.length}`);
		}));
	}
	setProgress(`0/${promises.length}`);
	return Promise.all(promises); // TODO add generic error handler
};
