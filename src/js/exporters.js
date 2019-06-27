//allows for multiple ways to export collected data
KG.exporters = {};

KG.exporters.list = {
	name: "list",
	extension: "txt",
	requireSamePage: false,
	requireDirectLinks: false,
	export: (data) => {
		var str = "";
		for (var i in data.episodes) {
			str += data.episodes[i].grabLink + "\n";
		}
		return str;
	}
}

KG.exporters.m3u = {
	name: "m3u8 playlist",
	extension: "m3u8",
	requireSamePage: true,
	requireDirectLinks: true,
	export: (data) => {
		var listing = $(".listing a").get().reverse();
		var str = "#EXTM3U\n";
		KG.for(data.episodes, (i, obj) => {
			str += `#EXTINF:0,${listing[obj.num-1].innerText}\n${obj.grabLink}\n`;
		});
		return str;
	}
}

KG.exporters.json = {
	name: "json",
	extension: "json",
	requireSamePage: true,
	requireDirectLinks: false,
	export: (data) => {
		var listing = $(".listing a").get().reverse();
		var json = {
			title: data.title,
			server: data.server,
			linkType: data.linkType,
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

KG.exporters.html = {
	name: "html list",
	extension: "html",
	requireSamePage: true,
	requireDirectLinks: true,
	export: (data) => {
		var listing = $(".listing a").get().reverse();
		var str = "<html>\n	<body>\n";
		KG.for(data.episodes, (i, obj) => {
			str += `		<a href="${obj.grabLink}" download="${listing[obj.num-1].innerText}.mp4">${listing[obj.num-1].innerText}</a><br>\n`;
		});
		str += "	</body>\n</html>\n";
		return str;
	}
}

KG.exporters.csv = {
	name: "csv",
	extension: "csv",
	requireSamePage: true,
	requireDirectLinks: false,
	export: (data) => {
		var listing = $(".listing a").get().reverse();
		var str = "episode, name, url\n";
		for (var i in data.episodes) {
			str += `${data.episodes[i].num}, ${listing[data.episodes[i].num-1].innerText}, ${data.episodes[i].grabLink}\n`;
		}
		return str;
	}
}

KG.exporters.aria2c = {
	name: "aria2c file",
	extension: "txt",
	requireSamePage: false,
	requireDirectLinks: true,
	export: (data) => {
		var padLength = Math.max(2, data.episodes[data.episodes.length - 1].num.toString().length);
		var str = "";
		KG.for(data.episodes, (i, obj) => {
			str += `${obj.grabLink}\n	-o E${obj.num.toString().padStart(padLength, "0")}.mp4\n`;
		});
		return str;
	}
}

KG.exporters.idmbat = {
	name: "IDM bat file",
	extension: "bat",
	requireSamePage: true,
	requireDirectLinks: true,
	export: (data) => {
		var listing = $(".listing a").get().reverse();
		var str = `::download and double click me!
@echo off
set title=${data.title}
set idm=${KG.preferences.idm_path}
set args=${KG.preferences.idm_arguments}
set path=%~dp0
if not exist "%idm%" echo IDM not found && echo check your IDM path in preferences && goto end
mkdir "%title%" > nul\n\n`;
		KG.for(data.episodes, (i, obj) => {
			str += `"%idm%" /n /p "%path%\\%title%" /f "${listing[obj.num-1].innerText}.mp4" /d "${obj.grabLink}" %args%\n`;
		});
		str += "\n:end\necho done.\necho.\npause";
		return str;
	}
}