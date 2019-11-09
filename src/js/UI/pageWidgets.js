const shared = require("./shared"),
	start = require("../start"),
	widget = require("./widget"),
	page = require("./page");

/**
 * Adds episode numbers and grab buttons to each episode
 */
exports.injectEpisodeListWidgets = () => {
	let epCount = page.episodeCount();
	$(".listing tr:eq(0)").prepend(`<th class="KG-episodelist-header">#</th>`);
	$(".listing tr:gt(1)").each((i, obj) => {
		let episode = epCount - i;
		$(`<input type="button" value="grab" class="KG-episodelist-button">&nbsp;`).click(() => {
				start(episode, episode, widget.getServer());
			})
			.prependTo($(obj).children(":eq(0)"));
		$(`<td class="KG-episodelist-number">${epCount-i}</td>`).prependTo(obj);
	});

	shared.applyColors();
};
