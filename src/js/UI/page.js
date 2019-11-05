exports.getEpisodeCount = () =>
	$(".listing a").length;

exports.getTitle = () =>
	$(".bigBarContainer a.bigChar").text();

exports.getEpisodeList = () =>
	$(`.listing a`).get().reverse();

exports.getHost = () =>
	location.hostname;

exports.reload = () =>
	location.reload();
