const gulp = require("gulp"),
	concat = require("gulp-concat"),
	insert = require("gulp-insert"),
	browserify = require("browserify"),
	source = require("vinyl-source-stream"),
	del = require("del"),
	fs = require("fs"),
	src_dir = "./src",
	build_dir = "./build",
	prelude_path = require.resolve("browser-pack").replace("index.js", "prelude.js");

var readFile = (path) => new Promise((resolve) => fs.readFile(path, (_err, data) => resolve(data.toString())))

var getPrelude = async () => {
	return "\n// bundled with browserify\n" + (await readFile(prelude_path)).replace(/\s*\/\/.*/g, "").trim();
}

function copy() {
	return gulp.src(`${src_dir}/js/**/*`)
		.pipe(insert.transform((contents, file) => `// src\\js\\${file.relative}\n${contents}`))
		.pipe(gulp.dest(`${build_dir}/js`));
}

function css() {
	return gulp.src(`${src_dir}/css/*.css`)
		.pipe(concat("css.js"))
		.pipe(insert.wrap("// generated file, provides contents of src\\css\nmodule.exports = `", "`;"))
		.pipe(gulp.dest(`${build_dir}/js`));
}

function html() {
	return gulp.src(`${src_dir}/html/*.html`)
		.pipe(insert.transform((contents, file) => `// src\\html\\${file.relative}\nexports[\`${file.stem}\`] = \`${contents}\`;`))
		.pipe(concat("html.js"))
		.pipe(insert.prepend("// generated file, provides contents of src\\html\n"))
		.pipe(gulp.dest(`${build_dir}/js`));
}

async function bundle() {
	return browserify({ entries: [`${build_dir}/js/main.js`] }, { prelude: await getPrelude(), preludePath: "./prelude" })
		.bundle()
		.pipe(source("bundle.js"))
		.pipe(insert.prepend(await readFile(`${src_dir}/header.txt`)))
		.pipe(gulp.dest(build_dir));
}

function clean() {
	return del(build_dir);
}

exports.build = gulp.series(clean, copy, css, html, bundle);
exports.clean = clean;
