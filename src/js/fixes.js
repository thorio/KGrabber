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

	//opts
	var $opts = $("#KG-opts-widget");
	var title = $opts.find(".barTitle").text();
	$opts.find(".barTitle").remove();
	$opts.find(".arrow-general").remove();
	$opts.before(`<div class="title-list icon">${title}</div><div class="clear2"></div>`)
}