//applies regex to html page to find a link
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

KG.get = (url) => {
	return new Promise((resolve, reject) => {
		GM_xmlhttpRequest({
			method: "GET",
			url: url,
			onload: (o) => {
				resolve(o.response);
			},
			onerror: () => {
				reject();
			}
		});
	});
}

KG.head = (url) => {
	return new Promise((resolve, reject) => {
		GM_xmlhttpRequest({
			method: "HEAD",
			url: url,
			onload: (o) => {
				resolve(o.status);
			},
			onerror: () => {
				reject();
			}
		});
	});
}