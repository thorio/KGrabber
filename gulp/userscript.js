/* eslint-env node */
const gulp = require("gulp"),
	concat = require("gulp-concat"),
	header = require("gulp-header"),
	browserify = require("browserify"),
	strictify = require("strictify"),
	less = require("gulp-less"),
	source = require("vinyl-source-stream"),
	strip = require("gulp-strip-comments"),
	del = require("del"),
	shared = require("./shared");

const src_dir = "./src",
	build_dir = "./build",
	header_path = `${src_dir}/header.txt`,
	version_number = require("../package.json").version; // get version from package.json

let watching = false;

/**
 * Suppresses errors and keeps the watcher from crashing
 * @param {Error} error
 */
function swallowIfWatching(error) {
	if (!watching) {
		throw error.toString();
	}
	console.error(error);
}

/**
 * Copy to build directory, strip comments, add filepath headers
 */
function js() {
	return gulp.src(`${src_dir}/js/**/!(package.json)`) // select all files in src/js/, except package.json
		.pipe(strip()) // strip comments
		.pipe(header("// src\\js\\${file.relative}\n")) // add info
		.pipe(gulp.dest(`${build_dir}/js`));
}

/**
 * Compile less, add filepath headers, concatenate to single file, wrap in js
 */
function css() {
	return gulp.src(`${src_dir}/css/*.less`)
		.pipe(header("/* src\\css\\${file.relative} */\n\n")) // add info
		.pipe(less()) // compile less
		.pipe(concat("css.js")) // combine into one file
		.pipe(shared.transform((_, contents) => `// generated file, provides contents of src\\css\nmodule.exports = \`\n${contents}\`;`))
		.pipe(gulp.dest(`${build_dir}/js`));
}

/**
 * Strip comments, add filepath headers, wrap in js
 */
async function html() {
	return gulp.src(`${src_dir}/html/*.html`)
		.pipe(strip()) // strip comments
		.pipe(shared.transform((file, contents) => `// src\\html\\${file.relative}\nexports[\`${file.stem}\`] = \`${contents}\`;`))
		.pipe(concat("html.js")) // combine into one file
		.pipe(header("// generated file, provides contents of src\\html\n")) // add info
		.pipe(gulp.dest(`${build_dir}/js`));
}

/**
 * Bundle with browserify, add userscript header
 */
async function bundle() {
	return browserify({
			entries: [`${build_dir}/js/main.js`], // specify entry point
			transform: [strictify], // add the strictify plugin to apply strict mode
		}, {
			prelude: await shared.getPrelude(), // apply the non-minified prelude
		})
		.bundle() // run browserify
		.on("error", swallowIfWatching) // suppress errors if using the watcher
		.pipe(source("bundle.js"))
		.pipe(header(await shared.readFile(header_path), { version: version_number })) // add the userscript header
		.pipe(gulp.dest(build_dir));
}

/**
 * Clear build directory
 */
function clean() {
	return del(`${build_dir}/**/*`);
}

/**
 * Auto-build on file change
 */
async function watch() {
	watching = true;
	gulp.watch(src_dir, build);
}

const build = gulp.series(js, css, html, bundle);

module.exports = { build, watch, clean };
