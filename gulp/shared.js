/* eslint-env node */
const gulp = require("gulp"),
	map = require("map-stream"),
	fs = require("fs");

const prelude_path = require.resolve("browser-pack").replace("index.js", "prelude.js"); // find unminified prelude

/**
 * Promisified fs.readFile; also converts buffer to string
 * @param {string} path
 * @returns {Promise<string>}
 */
exports.readFile = (path) => {
	return new Promise((resolve) => fs.readFile(path, (err, data) => resolve(data.toString())));
};

/**
 * Promisified fs.writeFile
 * @param {string} path
 * @returns {Promise<string>}
 */
exports.writeFile = (path, data) => {
	return new Promise((resolve) => fs.writeFile(path, data, () => resolve()));
};

/**
 * Fish out the unminified prelude from node_modules
 * @returns {Promise<string>}
 */
exports.getPrelude = async () => {
	return `\n// bundled with browserify\n` + (await exports.readFile(prelude_path)).replace(/\s*\/\/.*/g, "").trim();
};

/**
 * Allows to manipulate a file as a string
 * @param {function(Object, string):string} func
 */
exports.transform = (func) => {
	return map(async (file, callback) => {
		let contents = file.contents.toString();
		contents = await func(file, contents);
		file.contents = Buffer.from(contents);
		callback(null, file);
	});
};

/**
 * Copies a glob to a directory
 * @param {string} src
 * @param {string} dest
 * @returns {NodeJS.ReadWriteStream}
 */
exports.copy = (src, dest) => {
	return gulp
		.src(src)
		.pipe(gulp.dest(dest));
};

/**
 * Generates a module that exports the selected packages version
 * @param {string} packageDir
 * @param {string} outFile
 */
exports.genversion = async (packageDir, outFile) => {
	try {
		let package = JSON.parse(await exports.readFile(`${packageDir}/package.json`));
		let code = `// version of ${packageDir}\nmodule.exports = "${package.version}";`;
		await exports.writeFile(outFile, code);
	} catch (error) {
		throw { message: "version module could not be generated", error };
	}
};
