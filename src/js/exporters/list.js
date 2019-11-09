module.exports = {
	name: "list",
	extension: "txt",
	requireSamePage: false,
	linkTypes: ["direct", "embed"],
	export: (status) => {
		let str = "";
		for (let i in status.episodes) {
			str += status.episodes[i].grabLink + "\n";
		}
		return str;
	},
};
