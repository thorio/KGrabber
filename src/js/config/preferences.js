// default preferences
// TODO currently the codes repurposes this object to store user prefs, move storage to another object
module.exports = {
	general: {
		quality_order: "1080, 720, 480, 360",
	},
	internet_download_manager: {
		idm_path: "C:\\Program Files (x86)\\Internet Download Manager\\IDMan.exe",
		download_path: "%~dp0",
		arguments: "/a",
		keep_title_in_episode_name: false,
	},
	compatibility: {
		force_default_grabber: false,
		enable_experimental_grabbers: false,
		disable_automatic_actions: false,
	},
}
