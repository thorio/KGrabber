const page = require("../UI/page");

module.exports = {
	name: "csv",
	extension: "csv",
	requireSamePage: true,
	linkTypes: ["direct", "embed"],
	export: (status) => {
		let listing = page.episodeList();
		let str = "episode, name, url\n";
		for (let i in status.episodes) {
			str += `${status.episodes[i].num}, ${listing[status.episodes[i].num-1].innerText}, ${status.episodes[i].grabLink}\n`;
		}
		return str;
	},
};
