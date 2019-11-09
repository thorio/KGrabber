module.exports = {
	"env": {
		"browser": true,
		"commonjs": true,
		"es6": true,
		"greasemonkey": true,
		"jquery": true,
	},
	"extends": "eslint:recommended",
	"globals": {},
	"parserOptions": {
		"ecmaVersion": 2018,
	},
	"rules": {
		"require-atomic-updates": "off",
		"no-unused-vars": "warn",
		"no-useless-escape": "warn",
		"no-await-in-loop": "warn",
		"dot-location": ["warn", "property"],
		"semi": "warn",
		"no-restricted-globals": ["error", "status"],
		"comma-dangle": ["warn", {
			"arrays": "always-multiline",
			"objects": "always-multiline",
		}]
	}
}
