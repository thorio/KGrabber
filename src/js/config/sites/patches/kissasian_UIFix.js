function fix() {
	$(".KG-preferences-button").css("filter", "invert(0.7)");
	$(".KG-dialog-close").css("color", "#000");
	$(".KG-dialog-close").hover((e) => {
		$(e.target).css("color", e.type == "mouseenter" ? "#fff" : "#000");
	});
}

module.exports = fix;
