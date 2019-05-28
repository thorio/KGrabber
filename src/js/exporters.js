//allows for multiple ways to export collected data
KG.exporters = {};

KG.exporters.json = {
	name: "json",
	extension: "json",
	requireSamePage: true,
	export: (data) => {
		var listing = $(".listing a").get().reverse();
		var json = {
			title: data.title,
			server: data.server,
			episodes: []
		};
		for (var i in data.episodes) {
			json.episodes.push({
				number: data.episodes[i].num,
				name: listing[data.episodes[i].num - 1].innerText,
				link: data.episodes[i].grabLink
			});
		}
		return JSON.stringify(json);
	},
}

KG.exporters.csv = {
	name: "csv",
	extension: "csv",
	requireSamePage: true,
	export: (data) => {
		var listing = $(".listing a").get().reverse();
		var str = "episode, name, url\n";
		for (var i in data.episodes) {
			str += `${data.episodes[i].num}, ${listing[data.episodes[i].num-1].innerText}, ${data.episodes[i].grabLink}\n`;
		}
		return str;
	}
}

KG.exporters.list = {
	name: "list",
	extension: "txt",
	requireSamePage: false,
	export: (data) => {
		var str = "";
		for (var i in data.episodes) {
			str += data.episodes[i].grabLink + "\n";
		}
		return str;
	}
}

KG.exporters.aria2c = {
	name: "aria2c file",
	extension: "txt",
	requireSamePage: false,
	export: (data) => {
		var padLength = Math.max(2, data.episodes[data.episodes.length - 1].num.toString().length);
		var str = "";
		KG.for(data.episodes, (i, obj) => {
			str += `${obj.grabLink}\n	-o E${obj.num.toString().padStart(padLength, "0")}.mp4\n`;
		});
		return str;
	}
}