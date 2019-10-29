module.exports = {
	"env": {
		"browser": true,
		"commonjs": true,
		"es6": true
	},
	"extends": "eslint:recommended",
	"globals": {
		"$": "readonly",

		// tampermonkey
		"GM_getValue": "readonly",
		"GM_setValue": "readonly",
		"GM_xmlhttpRequest": "readonly",
		"unsafeWindow": "writable"
	},
	"parserOptions": {
		"ecmaVersion": 2018
	},
	"rules": {
		"require-atomic-updates": "off",
		"no-unused-vars": "warn",
		"no-useless-escape": "warn",
		"no-await-in-loop": "warn",
		"dot-location": ["warn", "property"],
		"semi": "warn"
	}
}
