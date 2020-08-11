/**
 * @typedef {import("kgrabber-types/Status")} Status
 */

const { LinkTypes, Exporter } = require("kgrabber-types");

module.exports = new Exporter({
	name: "curl (shell script)",
	extension: "sh",
	requireSamePage: false,
	linkTypes: [LinkTypes.DIRECT, LinkTypes.REFERER],
}, runExport);

const SHEBANG = "#!/use/bin/sh";

const HYDRAX_DOWNLOADER = `
# downloadHydraXVideo <slug> <output file> [hd|sd]
downloadHydraXVideo(){	
	url=\`
		curl "https://ping.idocdn.com/" -d "slug=$1" |
		sed -r 's/.*"url":"([a-zA-Z0-9=+-]*)".*/\\1/;s/(.*)(.)/\\2\\1/' |
		base64 -id
	\`;

	if [ "$3" != "sd" ]; then
		url="www.$url";
	fi

	curl --insecure "https://$url" -# -C - -H "Referer: https://playhydrax.com/?v=$1" -o "$2";
}
`
.replace(/\t/g, " ".repeat(4));
// Replace tabs with spaces inside script because pasting tabs might cause issues.

/**
 * @param {Status} status
 * @returns {String}
 */

function runExport(status) {
	let listing = $(".listing a").get().reverse();
	
	let episodes = status.episodes
		.filter(e => !e.error)
		.map(e => {
			return {
				link: e.grabbedLink,
				referer: e.processedLink.referer,
				name: sanitizeFileName(listing[e.episodeNumber - 1].innerText) + ".mp4"
			}
		});

	if(episodes.length == 0)
		return "";
	
	let script = [SHEBANG];
	
	if(status.serverID == "hydrax")
		script.push(HYDRAX_DOWNLOADER);
	
	for(let {name, link, referer} of episodes)
		if(status.serverID == "hydrax"){
			let slug = new URL(link).searchParams.get("v");
			script.push(`downloadHydraXVideo "${slug}" "${name}"`);
		}
		else if(status.linkType == LinkTypes.REFERER)
			script.push(`curl -# -C - -H "Referer: ${referer}" ${link}" -o "${name}"`);
		else
			script.push(`curl -# -C - "${link}" -o "${name}"`);
	
	return script.join("\n");
}

function sanitizeFileName(name, replaceWith = "-"){
	return name.replace(/[<>:"\/\\|?*]/g, replaceWith);
}