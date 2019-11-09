module.exports = {
	name: "json",
	extension: "json",
	requireSamePage: true,
	linkTypes: ["direct", "embed"],
	export: (status) => {
		let listing = $(".listing a").get().reverse();
		let json = {
			title: status.title,
			server: status.server,
			linkType: status.linkType,
			episodes: [],
		};
		for (let i in status.episodes) {
			json.episodes.push({
				number: status.episodes[i].num,
				name: listing[status.episodes[i].num - 1].innerText,
				link: status.episodes[i].grabLink,
			});
		}
		return JSON.stringify(json);
	},
};
