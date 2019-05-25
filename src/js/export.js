//allows for multiple ways to export collected data
KG.exporters = {};

KG.exporters.json = {
	name: "json",
	export: (data) => {
		return "json? never heard of that";
	},
}

KG.exporters.csv = {
	name: "csv",
	export: (data) => {
		return "wtf is csv";
	}
}