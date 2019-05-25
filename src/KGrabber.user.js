// ==UserScript==
// @name					KissGrabber
// @namespace			thorou.tk
// @version				2.0~beta1
// @description		gets embed links from kissanime.ru
// @author				Thorou
// @homepageURL		https://github.com/thorio/kaGrabber/
// @updateURL			https://github.com/thorio/kaGrabber/raw/master/kaGrabber.user.js
// @downloadURL		https://github.com/thorio/kaGrabber/raw/master/kaGrabber.user.js
// @match					https://kissanime.ru/*
// @noframes
// ==/UserScript==
//
//Copyright 2018 Leon Timm
//
//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

window.KG = {};

[[[[js/data.js]]]]

[[[[js/util.js]]]]

[[[[js/main.js]]]]

[[[[js/steps.js]]]]

//HTML and CSS pasted here because Tampermonkey apparently doesn't allow resources to be updated
//if you have a solution for including extra files that are updated when the script is reinstalled please let me know: thorio.git@gmail.com

//the grabber widget injected into the page
var optsHTML = `[[[[html/opts.html]]]]`;

//initially hidden HTML that is revealed and filled in by the grabber script
var linkListHTML = `[[[[html/linkdisplay.html]]]]`;

//css to make it all look good
var grabberCSS = `[[[[css/grabber.css]]]]`;

KG.siteLoad();