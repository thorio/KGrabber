//#region Misc
//applies regex to html to find a link
KG.findLink = (html, regexString) => {
	var re = new RegExp(regexString);
	var result = html.match(re);
	if (result && result.length > 0) {
		return result[0].split('"')[1];
	}
	return "";
}

//wildcard-enabled string comparison
KG.if = (str, rule) => {
	return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
}

//iterates over an array with supplied function
//either (array, min, max, func)
//or     (array, func)
KG.for = (array, min, max, func) => {
	if (typeof min == "function") {
		func = min;
		max = array.length - 1;
	}
	min = Math.max(0, min) || 0;
	max = Math.min(array.length - 1, max);
	for (var i = min; i <= max; i++) {
		func(i, array[i]);
	}
}

//removes characters that have special meaning in a batch file or are forbidden in directory names
KG.makeBatSafe = (str) => {
	return str.replace(/[%^&<>|:\\/?*"]/g, "_");
}

KG.timeout = (time) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time)
	});
}

//returns parsed json or undefined if parse fails
KG.tryParseJson = (str) => {
	try {
		return JSON.parse(str);
	} catch {}
}
//#endregion

//#region Logging
var logCss = "background-color: #456304; padding: 0 5px; border-radius: 3px; color: #fff;";

KG.loginfo = (...obj) => {
	console.info("%cKissGrabber", logCss, ...obj);
}

KG.log = (...obj) => {
	console.log("%cKissGrabber", logCss, ...obj);
}

KG.logwarn = (...obj) => {
	console.warn("%cKissGrabber", logCss, ...obj);
}

KG.logerr = (...obj) => {
	console.error("%cKissGrabber", logCss, ...obj);
}
//#endregion

//#region Ajax Helpers
KG.get = (url, headers) => {
	return new Promise((resolve, reject) => {
		GM_xmlhttpRequest({
			method: "GET",
			url,
			headers,
			onload: resolve,
			onerror: reject,
		});
	});
}

KG.head = (url, headers) => {
	return new Promise((resolve, reject) => {
		GM_xmlhttpRequest({
			method: "HEAD",
			url,
			headers,
			onload: resolve,
			onerror: reject,
		});
	});
}

KG.post = (url, data, headers) => {
	return new Promise((resolve, reject) => {
		GM_xmlhttpRequest({
			method: "POST",
			url,
			data,
			headers,
			onload: resolve,
			onerror: reject,
		});
	});
}
//#endregion
