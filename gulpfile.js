/* eslint-env node */
const { build, watch, clean } = require("./gulp/userscript");
const { buildModules } = require("./gulp/modules");

module.exports = { build, watch, clean, buildModules };
