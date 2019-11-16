const log = require("../util/log"),
	shared = require("./shared"),
	html = require("../html"),
	page = require("./page"),
	preferenceManager = require("../config/preferenceManager");

let hasLoaded = false;

exports.show = () => {
	if (!hasLoaded) {
		load(preferenceManager.get());
		hasLoaded = true;
	}
	$("#KG-preferences").slideDown();
};

let hide = exports.hide = () =>
	$("#KG-preferences").slideUp();

exports.inject = () => {
	$("#leftside").prepend(html.preferences);
	setHandlers();
};

let load = (preferences) => {
	for (let i in preferences) {
		let group = preferences[i];
		let $group = $(`<div id="KG-preferences-container"></div>`);
		for (let j in preferences[i]) {
			let html = "";
			switch (typeof group[j]) {
				case "string":
					html = `<div><span>${j.replace(/_/g, " ")}:</span><input type="text" value="${group[j]}" class="KG-input-text right" id="KG-preference-${i}-${j}"></div>`;
					break;
				case "boolean":
					html = `<div><span>${j.replace(/_/g, " ")}:</span><input type="checkbox" ${group[j] ? "checked" : ""} class="KG-input-checkbox right" id="KG-preference-${i}-${j}"></div>`;
					break;
				case "number":
					html = `<div><span>${j.replace(/_/g, " ")}:</span><input type="number" value="${group[j]}" class="KG-input-text right" id="KG-preference-${i}-${j}"></div>`;
					break;
				default:
					log.err(`unknown type "${typeof group[j]}" of preferences.${i}.${j}`);
			}
			$group.append(html);
		}
		let headerTitle = i.replace(/_/g, " ").replace(/[a-z]+/g, (s) => s.charAt(0).toUpperCase() + s.slice(1));
		$("#KG-preferences-container-outer").append(`<div class="KG-preferences-header KG-bigChar">${headerTitle}</div>`)
			.append($group);
	}
	shared.applyColors();
};

function setHandlers() {
	$("#KG-preferences .KG-dialog-close").click(() => {
		hide();
	});
	$("#KG-preferences-save").click(() => {
		preferenceManager.save(read());
		hide();
	});
	$("#KG-preferences-reset").click(() => {
		preferenceManager.reset();
		page.reload();
	});
}

function read() {
	let preferences = {};
	$("#KG-preferences-container input").each((i, obj) => {
		let ids = obj.id.slice(14).match(/[^-]+/g);
		let value;
		switch (obj.type) {
			case "checkbox":
				value = obj.checked;
				break;
			default:
				value = obj.value;
				break;
		}
		if (!preferences[ids[0]]) {
			preferences[ids[0]] = {};
		}
		preferences[ids[0]][ids[1]] = value;
	});
	return preferences;
}
