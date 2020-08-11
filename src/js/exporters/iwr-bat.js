/**
 * @typedef {import("kgrabber-types/Status")} Status
 */

const { LinkTypes, Exporter } = require("kgrabber-types");

module.exports = new Exporter({
	name: "Invoke-WebRequest (bat script)",
	extension: "bat",
	requireSamePage: false,
	linkTypes: [LinkTypes.DIRECT, LinkTypes.REFERER],
}, runExport);

const BAT_HEADER = `
<# ::
@setlocal & copy "%~f0" "%TEMP%\%~0n.ps1" >NUL && powershell -NoProfile -ExecutionPolicy Bypass -File "%TEMP%\%~0n.ps1" %*
@set "ec=%ERRORLEVEL%" & del "%TEMP%\%~0n.ps1"
@exit /b %ec%
#>
`;

const HYDRAX_DOWNLOADER = `
# downloadHydraXVideo <slug> <output file> [hd|sd]
function downloadHydraXVideo($1, $2, $3){
	$progressPreference = "silentlyContinue";
	
	$response = Invoke-WebRequest "https://ping.idocdn.com/" \`
			-UseBasicParsing \`
			-Method POST \`
			-Body @{slug = "$1"};
	
	$urlBase64 = (ConvertFrom-Json $response.Content).url;
	
    $url = [System.Text.Encoding]::UTF8.GetString(
			[System.Convert]::FromBase64String(
				$urlBase64.Chars($urlBase64.Length - 1) + $urlBase64.Substring(0, $urlBase64.Length - 1)
			)
		);
	
	if("$3" -ne "sd"){
		$url = "www." + $url;
	}
	
	Invoke-WebRequest "https://$url" \`
		-UseBasicParsing \`
		-Headers @{Referer = "https://playhydrax.com/?v=$1"} \`
		-OutFile "$2";
	
	$progressPreference = "Continue";
}
`;

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
	
	let script = [BAT_HEADER];
	
	if(status.serverID == "hydrax")
		script.push(HYDRAX_DOWNLOADER);
	
	for(let {name, link, referer} of episodes)
		if(status.serverID == "hydrax"){
			let slug = new URL(link).searchParams.get("v");
			script.push(`downloadHydraXVideo "${slug}" "${name}"`);
		}
		else if(status.linkType == LinkTypes.REFERER)
			script.push(`Invoke-WebRequest "${link}" -Headers @{Referer = "${referer}"} -OutFile "${name}"`);
		else
			script.push(`Invoke-WebRequest "${link}" -OutFile "${name}""`);
	
	return script.join("\n");
}

function sanitizeFileName(name, replaceWith = "-"){
	return name.replace(/[<>:"\/\\|?*]/g, replaceWith);
}