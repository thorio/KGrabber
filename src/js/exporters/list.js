const LinkTypes = require("../types/LinkTypes");

module.exports = {
	name: "list",
	extension: "txt",
	requireSamePage: false,
	linkTypes: [LinkTypes.DIRECT, LinkTypes.EMBED],
	export: (status) => {
		let str = "";
		for (let i in status.episodes) {
			str += status.episodes[i].grabLink + "\n";
		}
		return str;
	},
};
