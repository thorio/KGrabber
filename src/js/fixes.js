//if something doesn't look right on a specific site, a fix can be written here
KG.fixes = {}

KG.fixes["kimcartoon.to_UIFix"] = () => {
	//linkdisplay
	var $ld = $("#KG-linkdisplay");
	$ld.find(".barTitle").removeClass("barTitle")
		.css({
			"height": "20px",
			"padding": "5px",
		});
	$("#KG-linkdisplay-title").css({
		"font-size": "20px",
		"color": $("a.bigChar").css("color"),
	})
	$ld.find(".arrow-general").remove();

	//preference panel
	var $pf = $("#KG-preferences");
	$pf.find(".barTitle").removeClass("barTitle")
		.css({
			"height": "20px",
			"padding": "5px",
		});
	$("#KG-linkdisplay-title").css({
		"font-size": "20px",
		"color": $("a.bigChar").css("color"),
	});
	$pf.find(".arrow-general").remove();

	//opts
	var $opts = $("#KG-opts-widget");
	var title = $opts.find(".barTitle").html();
	$opts.before(`<div class="title-list icon">${title}</div><div class="clear2"></div>`);
	$(".icon:eq(1)").css({ "width": "100%", "box-sizing": "border-box" });
	$(".KG-preferences-button").css("margin-top", "5px");
	$opts.find(".barTitle").remove();
	$opts.find(".arrow-general").remove();

	//general
	$(".KG-dialog-title").css("font-size", "18px");
}

KG.fixes["kissasian.sh_UIFix"] = () => {
	$(".KG-preferences-button").css("filter", "invert(0.7)");
	$(".KG-dialog-close").css("color", "#000");
	$(".KG-dialog-close").hover((e) => {
		$(e.target).css("color", e.type == "mouseenter" ? "#fff" : "#000");
	});
}
