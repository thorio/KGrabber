const log = require("./log");

let scriptsLoaded = false;

function loadScript(name) {
	$(`<script src="${location.origin}/Scripts/${name}.js" />`)
		.appendTo("head");
}

// TODO load scripts asynchronously
// loads the scripts kissmanga uses to decrypt their links
function loadScripts() {
	if (!scriptsLoaded) {
		loadScript("css");
		loadScript("vr");
		log.log("loading scripts");
		scriptsLoaded = true;
	}
}

exports.decrypt = async (encrypted) => {
	loadScripts();
	return unsafeWindow.ovelWrap(encrypted);
};
