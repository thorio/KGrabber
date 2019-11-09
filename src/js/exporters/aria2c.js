module.exports = {
	name: "aria2c file",
	extension: "txt",
	requireSamePage: false,
	linkTypes: ["direct"],
	export: (status) => {
		let listing = $(".listing a").get().reverse();
		let str = "";
		for (let episode of status.episodes) {
			str += `${episode.grabLink}\n out=${listing[episode.num-1].innerText}.mp4\n`;
		}
		return str;
	},
};
