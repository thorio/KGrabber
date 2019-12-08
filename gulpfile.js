/* eslint-env node */
const gulp = require("gulp"),
	concat = require("gulp-concat"),
	map = require("map-stream"),
	header = require("gulp-header"),
	browserify = require("browserify"),
	strictify = require("strictify"),
	source = require("vinyl-source-stream"),
	strip = require("gulp-strip-comments"),
	del = require("del"),
	fs = require("fs");

const src_dir = "./src",
	build_dir = "./build",
	header_path = `${src_dir}/header.txt`,
	prelude_path = require.resolve("browser-pack").replace("index.js", "prelude.js"),
	version_number = require("./package.json").version;

let watching = false;

function readFile(path) {
	return new Promise((resolve) => fs.readFile(path, (_err, data) => resolve(data.toString())));
}

async function getHeader() {
	return readFile(header_path);
}

async function getPrelude() {
	return `\n// bundled with browserify\n` + (await readFile(prelude_path)).replace(/\s*\/\/.*/g, "").trim();
}

function swallowIfWatching(error) {
	if (!watching) {
		throw error.toString();
	}
}

function transform(func) {
	return map(async (file, callback) => {
		let contents = file.contents.toString();
		contents = await func(file, contents);
		file.contents = Buffer.from(contents);
		callback(null, file);
	});
}

function copy() {
	return gulp.src(`${src_dir}/js/**/*`)
		.pipe(strip())
		.pipe(header("// src\\js\\${file.relative}\n"))
		.pipe(gulp.dest(`${build_dir}/js`));
}

function css() {
	return gulp.src(`${src_dir}/css/*.css`)
		.pipe(header("/* src\\css\\${file.relative} */\n\n"))
		.pipe(concat("css.js"))
		.pipe(transform((_, contents) => `// generated file, provides contents of src\\css\nmodule.exports = \`\n${contents}\`;`))
		.pipe(gulp.dest(`${build_dir}/js`));
}

async function html() {
	return gulp.src(`${src_dir}/html/*.html`)
		.pipe(strip())
		.pipe(transform((file, contents) => `// src\\html\\${file.relative}\nexports[\`${file.stem}\`] = \`${contents}\`;`))
		.pipe(concat("html.js"))
		.pipe(header("// generated file, provides contents of src\\html\n"))
		.pipe(gulp.dest(`${build_dir}/js`));
}

async function bundle() {
	return browserify({ entries: [`${build_dir}/js/main.js`], transform: [strictify] }, { prelude: await getPrelude(), preludePath: "./prelude" })
		.bundle()
		.on("error", swallowIfWatching)
		.pipe(source("bundle.js"))
		.pipe(header(await getHeader(), { version: version_number }))
		.pipe(gulp.dest(build_dir));
}

function clean() {
	return del(`${build_dir}/**/*`);
}

function watch() {
	watching = true;
	gulp.watch(src_dir, build);
}

const build = gulp.series(copy, css, html, bundle);

module.exports = { build, bundle, watch, clean };
