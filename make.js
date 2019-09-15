var fs = require('fs');

var dir = "\\src\\";
var srcfile = "KGrabber.user.js";
var destfile = "KGrabber.user.js"; // <- in directory of this file!

var data = fs.readFileSync(__dirname + dir + srcfile, 'utf8');

while (true) {
	var match = data.match(/\/\*include::(.+)\*\//); //scan for next tag in format '[[[[filename]]]]'
	if (!match) { //all tags taken care of
		break;
	}
	data = data.replace(match[0], fs.readFileSync(__dirname + dir + match[1], 'utf8')); //replace tag with file contents

}

fs.writeFileSync(__dirname + "\\" + destfile, data, 'utf8');

console.log("done!");
