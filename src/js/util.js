//applies regex to html page to find a link
KG.findLink = (regexString) => {
	var re = new RegExp(regexString);
	return document.body.innerHTML.match(re);
}

//wildcard-enabled string comparison
KG.if = (str, rule) => {
	return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
}