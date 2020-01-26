const config = require("../config");

exports.applyColors = () => {
	let site = config.sites.current();
	$(".KG-episodelist-button, .KG-button")
		.css({ "color": site.buttonTextColor, "background-color": site.buttonColor });
	$(".KG-preferences-header")
		.css({ "color": $(".bigChar").css("color") });
};
