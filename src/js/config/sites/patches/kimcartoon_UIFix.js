function fix() {
	fixLinkDisplay();
	fixPreferences();
	fixWidget();
	$(".KG-dialog-title").css("font-size", "18px");
}

function fixLinkDisplay() {
	let $ld = $("#KG-linkdisplay");
	$ld.find(".barTitle").removeClass("barTitle")
		.css({
			"height": "20px",
			"padding": "5px",
		});
	$("#KG-linkdisplay-title").css({
		"font-size": "20px",
		"color": $("a.bigChar").css("color"),
	});
	$ld.find(".arrow-general").remove();
}

function fixPreferences() {
	let $pf = $("#KG-preferences");
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
}

function fixWidget() {
	let $opts = $("#KG-opts-widget");
	$opts.insertAfter(`#rightside .clear2:eq(2)`);
	let title = $opts.find(".barTitle").html();
	$opts.before(`<div class="title-list icon">${title}</div><div class="clear2"></div>`);
	$(".icon:eq(1)").css({ "width": "100%", "box-sizing": "border-box" });
	$(".KG-preferences-button").css("margin-top", "5px");
	$opts.find(".barTitle").remove();
	$opts.find(".arrow-general").remove();
}

module.exports = fix;
