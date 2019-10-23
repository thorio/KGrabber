// ==UserScript==
// @name          KissGrabber
// @namespace     thorou
// @version       2.6.2
// @description   extracts embed links from kiss sites
// @author        Thorou
// @license       GPLv3 - http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright     2019 Leon Timm
// @homepageURL   https://github.com/thorio/KGrabber/
// @match         http*://kissanime.ru/*
// @match         http*://kimcartoon.to/*
// @match         http*://kissasian.sh/*
// @match         http*://kisstvshow.to/*
// @run-at        document-end
// @noframes
// @grant         GM_xmlhttpRequest
// @grant         GM_getValue
// @grant         GM_setValue
// @connect       rapidvideo.com
// @connect       googleusercontent.com
// @connect       googlevideo.com
// @connect       novelplanet.me
// ==/UserScript==

if (!unsafeWindow.jQuery) {
	console.error("KG: jQuery not present");
	return;
}

unsafeWindow.KG = {};

/*include::js/data.js*/

/*include::js/main.js*/

/*include::js/util.js*/

/*include::js/steps.js*/

/*include::js/exporters.js*/

/*include::js/actions.js*/

/*include::js/fixes.js*/

//HTML and CSS pasted here because Tampermonkey apparently doesn't allow resources to be updated

//the grabber widget injected into the page
var optsHTML = `/*include::html/opts.html*/`;

//the link display
var linkListHTML = `/*include::html/linkdisplay.html*/`;

//the settings page
var prefsHTML = `/*include::html/preferences.html*/`;

//css to make it all look good
var grabberCSS = `/*include::css/grabber.css*/`;

KG.siteLoad();
