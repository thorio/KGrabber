/* eslint-env node */
const gulp = require("gulp"),
	concat = require("gulp-concat"),
	map = require("map-stream"),
	header = require("gulp-header"),
	browserify = require("browserify"),
	strictify = require("strictify"),
	less = require("gulp-less"),
	source = require("vinyl-source-stream"),
	strip = require("gulp-strip-comments"),
	del = require("del"),
	fs = require("fs");

const src_dir = "./src",
	build_dir = "./build",
	header_path = `${src_dir}/header.txt`,
	prelude_path = require.resolve("browser-pack").replace("index.js", "prelude.js"), // find unminified prelude
	version_number = require("./package.json").version; // get version from package.json

let watching = false;

// promisified fs.readFile; also converts buffer to string
function readFile(path) {
	return new Promise((resolve) => fs.readFile(path, (_err, data) => resolve(data.toString())));
}

// read the header file
async function getHeader() {
	return readFile(header_path);
}

// fish out the unminified prelude from node_modules
async function getPrelude() {
	return `\n// bundled with browserify\n` + (await readFile(prelude_path)).replace(/\s*\/\/.*/g, "").trim();
}

// suppresses errors and keeps the watcher from crashing
function swallowIfWatching(error) {
	if (!watching) {
		throw error.toString();
	}
	console.error(error);
}

// allows to manipulate a file as a string
function transform(func) {
	return map(async (file, callback) => {
		let contents = file.contents.toString();
		contents = await func(file, contents);
		file.contents = Buffer.from(contents);
		callback(null, file);
	});
}

function js() {
	return gulp.src(`${src_dir}/js/**/!(package.json)`) // select all files in src/js/, except package.json
		.pipe(strip()) // strip comments
		.pipe(header("// src\\js\\${file.relative}\n")) // add info
		.pipe(gulp.dest(`${build_dir}/js`));
}

function css() {
	return gulp.src(`${src_dir}/css/*.less`)
		.pipe(header("/* src\\css\\${file.relative} */\n\n")) // add info
		.pipe(less()) // compile less
		.pipe(concat("css.js")) // combine into one file
		.pipe(transform((_, contents) => `// generated file, provides contents of src\\css\nmodule.exports = \`\n${contents}\`;`))
		.pipe(gulp.dest(`${build_dir}/js`));
}

async function html() {
	return gulp.src(`${src_dir}/html/*.html`)
		.pipe(strip()) // strip comments
		.pipe(transform((file, contents) => `// src\\html\\${file.relative}\nexports[\`${file.stem}\`] = \`${contents}\`;`))
		.pipe(concat("html.js")) // combine into one file
		.pipe(header("// generated file, provides contents of src\\html\n")) // add info
		.pipe(gulp.dest(`${build_dir}/js`));
}

async function bundle() {
	return browserify({
			entries: [`${build_dir}/js/main.js`], // specify entry point
			transform: [strictify], // add the strictify plugin to apply strict mode
		}, {
			prelude: await getPrelude(), // apply the non-minified prelude
		})
		.bundle() // run browserify
		.on("error", swallowIfWatching) // suppress errors if using the watcher
		.pipe(source("bundle.js"))
		.pipe(header(await getHeader(), { version: version_number })) // add the userscript header
		.pipe(gulp.dest(build_dir));
}

// clear build directory
function clean() {
	return del(`${build_dir}/**/*`);
}

// auto-build on file change
async function watch() {
	watching = true;
	await clean();
	await build();
	gulp.watch(src_dir, build);
}

const build = gulp.series(js, css, html, bundle);

module.exports = { build, watch, clean };
