//allows for multiple ways to export collected data
const util = require("../util"),
	preferences = require("../config").preferences;

exports.list = {
	name: "list",
	extension: "txt",
	requireSamePage: false,
	requireDirectLinks: false,
	export: (data) => {
		let str = "";
		for (let i in data.episodes) {
			str += data.episodes[i].grabLink + "\n";
		}
		return str;
	}
};

exports.m3u = {
	name: "m3u8 playlist",
	extension: "m3u8",
	requireSamePage: true,
	requireDirectLinks: true,
	export: (data) => {
		let listing = $(".listing a").get().reverse();
		let str = "#EXTM3U\n";
		util.for(data.episodes, (i, obj) => {
			str += `#EXTINF:0,${listing[obj.num-1].innerText}\n${obj.grabLink}\n`;
		});
		return str;
	}
};

exports.json = {
	name: "json",
	extension: "json",
	requireSamePage: true,
	requireDirectLinks: false,
	export: (data) => {
		let listing = $(".listing a").get().reverse();
		let json = {
			title: data.title,
			server: data.server,
			linkType: data.linkType,
			episodes: []
		};
		for (let i in data.episodes) {
			json.episodes.push({
				number: data.episodes[i].num,
				name: listing[data.episodes[i].num - 1].innerText,
				link: data.episodes[i].grabLink
			});
		}
		return JSON.stringify(json);
	},
};

exports.html = {
	name: "html list",
	extension: "html",
	requireSamePage: true,
	requireDirectLinks: true,
	export: (data) => {
		let listing = $(".listing a").get().reverse();
		let str = "<html>\n	<body>\n";
		util.for(data.episodes, (i, obj) => {
			str += `		<a href="${obj.grabLink}" download="${listing[obj.num-1].innerText}.mp4">${listing[obj.num-1].innerText}</a><br>\n`;
		});
		str += "	</body>\n</html>\n";
		return str;
	}
};

exports.csv = {
	name: "csv",
	extension: "csv",
	requireSamePage: true,
	requireDirectLinks: false,
	export: (data) => {
		let listing = $(".listing a").get().reverse();
		let str = "episode, name, url\n";
		for (let i in data.episodes) {
			str += `${data.episodes[i].num}, ${listing[data.episodes[i].num-1].innerText}, ${data.episodes[i].grabLink}\n`;
		}
		return str;
	}
};

exports.aria2c = {
	name: "aria2c file",
	extension: "txt",
	requireSamePage: false,
	requireDirectLinks: true,
	export: (data) => {
		let listing = $(".listing a").get().reverse();
		let str = "";
		util.for(data.episodes, (i, obj) => {
			str += `${obj.grabLink}\n out=${listing[obj.num-1].innerText}.mp4\n`;
		});
		return str;
	}
};

exports.idmbat = {
	name: "IDM bat file",
	extension: "bat",
	requireSamePage: true,
	requireDirectLinks: true,
	export: (data) => {
		let listing = $(".listing a").get().reverse();
		let title = util.makeBatSafe(data.title);
		let str = `::download and double click me!
@echo off
set title=${title}
set idm=${preferences.internet_download_manager.idm_path}
set args=${preferences.internet_download_manager.arguments}
set dir=${preferences.internet_download_manager.download_path}
if not exist "%idm%" echo IDM not found && echo check your IDM path in preferences && pause && goto eof
mkdir "%title%" > nul
start "" "%idm%"
ping localhost -n 2 > nul\n\n`;
		util.for(data.episodes, (i, obj) => {
			let epTitle = util.makeBatSafe(listing[obj.num - 1].innerText);
			if (!preferences.internet_download_manager.keep_title_in_episode_name &&
				epTitle.slice(0, title.length) === title) {
				epTitle = epTitle.slice(title.length + 1);
			}
			str += `"%idm%" /n /p "%dir%\\%title%" /f "${epTitle}.mp4" /d "${obj.grabLink}" %args%\n`;
		});
		return str;
	}
};
