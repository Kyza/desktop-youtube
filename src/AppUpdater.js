const { app, session, BrowserWindow, screen } = require("electron");
const { autoUpdater } = require("electron-updater");
// const { width, height } = screen.getPrimaryDisplay().workAreaSize;

// const updaterWindow = new BrowserWindow({
// 	title: "Desktop YouTube",
// 	width: width / 1.25,
// 	height: height / 1.25,
// 	minimizable: false,
// 	center: true,
// 	resizable: false,
// 	movable: false,
// 	closable: false,
// 	focusable: false,
// 	fullscreenable: false,
// 	frame: false,
// 	transparent: true,
// 	backgroundColor: "#00000000",
// 	show: false,
// });

// updaterWindow.once("ready-to-show", updaterWindow.show);

// updaterWindow.loadFile("public/index.html");

autoUpdater.on("update-downloaded", (info) => {
	console.log(info);
	autoUpdater.quitAndInstall(true, true);
});

class AppUpdater {
	constructor(intervalTime) {
		autoUpdater.checkForUpdatesAndNotify();
		this.updateInterval = setInterval(() => {
			autoUpdater.checkForUpdatesAndNotify();
		}, intervalTime);
	}
}

module.exports = AppUpdater;
