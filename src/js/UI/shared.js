const config = require("../config");

exports.applyColors = () => {
	let site = config.sites.current();
	$(".KG-episodelist-button, .KG-button")
		.css({ "color": site.buttonTextColor, "background-color": site.buttonColor });
	$(".KG-bigChar")
		.css("color", $(".bigChar").css("color"));
};
