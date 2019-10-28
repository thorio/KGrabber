exports.get = (url, headers) => {
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

exports.head = (url, headers) => {
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

exports.post = (url, data, headers) => {
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
