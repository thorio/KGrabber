// ==UserScript==
// @name          KissGrabber
// @namespace     thorou
// @version       2.0~beta1
// @description   extracts embed links from kiss sites
// @author        Thorou
// @license       GPLv3 - http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright     2019 Leon Timm
// @homepageURL   https://github.com/thorio/KGrabber/
// @updateURL     https://github.com/thorio/KGrabber/raw/master/KGrabber.user.js
// @downloadURL   https://github.com/thorio/KGrabber/raw/master/KGrabber.user.js
// @match         https://kissanime.ru/*
// @match         https://kimcartoon.to/*
// @match         https://kissasian.sh/*
// @run-at        document-end
// @noframes
// ==/UserScript==

window.KG = {};

[[[[js/data.js]]]]

[[[[js/main.js]]]]

[[[[js/util.js]]]]

[[[[js/steps.js]]]]

[[[[js/exporters.js]]]]

[[[[js/fixes.js]]]]

//HTML and CSS pasted here because Tampermonkey apparently doesn't allow resources to be updated
//if you have a solution for including extra files that are updated when the script is reinstalled please let me know: thorio.git@gmail.com

//the grabber widget injected into the page
var optsHTML = `[[[[html/opts.html]]]]`;

//initially hidden HTML that is revealed and filled in by the grabber script
var linkListHTML = `[[[[html/linkdisplay.html]]]]`;

//css to make it all look good
var grabberCSS = `[[[[css/grabber.css]]]]`;

KG.siteLoad();