const util = require("../util");

module.exports = {
	name: "m3u8 playlist",
	extension: "m3u8",
	requireSamePage: true,
	linkTypes: ["direct"],
	export: (status) => {
		let listing = $(".listing a").get().reverse();
		let str = "#EXTM3U\n";
		util.for(status.episodes, (i, obj) => {
			str += `#EXTINF:0,${listing[obj.num-1].innerText}\n${obj.grabLink}\n`;
		});
		return str;
	},
};
