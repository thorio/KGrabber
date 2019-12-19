exports.linkDisplay = () => {
	let $ld = $("#KG-linkdisplay");
	$("#KG-linkdisplay-title").css({
		"font-size": "20px",
		"color": $("a.bigChar").css("color"),
	});
	fixTitle($ld);
};

exports.preferences = () => {
	let $pf = $("#KG-preferences");
	fixTitle($pf);
};

exports.widget = () => {
	let $opts = $("#KG-opts-widget");
	$opts.insertAfter(`#rightside .clear2:eq(2)`);
	let title = $opts.find(".barTitle").html();
	$opts.before(`<div class="title-list icon">${title}</div><div class="clear2"></div>`);
	$(".icon:eq(1)").css({ "width": "100%", "box-sizing": "border-box" });
	$(".KG-preferences-button").css("margin-top", "5px");
	$opts.find(".barTitle").remove();
	fixTitle($opts);
};

function fixTitle(element) {
	$(".KG-dialog-title").css("font-size", "18px");
	element.find(".arrow-general").remove();
	element.find(".barTitle").removeClass("barTitle")
		.css({
			"height": "20px",
			"padding": "5px",
		});
}
