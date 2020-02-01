/* eslint-env node */
const gulp = require("gulp"),
	typescript = require("gulp-typescript"),
	merge = require("merge-stream"),
	shared = require("./shared");

const src_dir = "./src/js",
	build_dir = "./build/modules";

/**
 * Copies a directory under src/node_modules to build
 * @param {string} moduleName
 */
function copyModule(moduleName) {
	return shared.copy(`${src_dir}/node_modules/${moduleName}/**/*`, `${build_dir}/${moduleName}`);
}

/**
 * Build kgrabber-plugin
 */
function plugin() {
	let moduleName = "kgrabber-plugin";

	let copy = copyModule(moduleName);

	let statusManager = gulp.src([`${src_dir}/statusManager.js`, `${src_dir}/ui/{pluginExposed,captchaModal,linkDisplay,page}.js`])
		.pipe(typescript({
			allowJs: true,
			declaration: true,
			emitDeclarationOnly: true,
		}))
		.pipe(gulp.dest(`${build_dir}/${moduleName}`));

	return merge(copy, statusManager);
}

/**
 * Build kgrabber-types
 */
function types() {
	let moduleName = "kgrabber-types";
	return copyModule(moduleName);
}

const buildModules = gulp.parallel(types, plugin);

module.exports = { buildModules };
