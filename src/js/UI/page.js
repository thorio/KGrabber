const util = require("../util");

exports.episodeCount = () =>
	$(".listing a").length;

exports.title = () =>
	$(".bigBarContainer a.bigChar").text();

exports.episodeList = () =>
	$(`.listing a`).get().reverse();

exports.reload = () =>
	location.reload();

Object.defineProperty(exports, "href", {
	get: () => location.href,
	set: (href) => location.href = href,
});

Object.defineProperty(exports, "location", {
	get: () => util.merge({}, location),
});
