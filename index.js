const { app, session, BrowserWindow, screen } = require("electron");
require("./main-api");

let window;

if (!app.requestSingleInstanceLock()) {
	app.quit();
} else {
	app.on("second-instance", (event, commandLine, workingDirectory) => {
		// Someone tried to run a second instance, we should focus our window.
		if (window) {
			if (window.isMinimized()) window.restore();
			window.focus();
		}
	});

	// Create window, load the rest of the app, etc...
	new (require("./src/AppUpdater.js"))(10 * 60 * 1e3);
	require("electron-reload")(__dirname);

	const createWindow = () => {
		const { width, height } = screen.getPrimaryDisplay().workAreaSize;

		window = new BrowserWindow({
			width: width / 1.25,
			height: height / 1.25,
			center: true,
			// frame: false,
			show: false,
			webPreferences: {
				scrollBounce: true,
				webviewTag: true,
				nodeIntegration: true,
			},
		});

		window.webContents.openDevTools();

		window.setMenu(null);

		window.once("ready-to-show", window.show);

		window.loadFile("public/index.html");
	};

	app.on("ready", () => {
		// Fix Google login.
		session.defaultSession.webRequest.onBeforeSendHeaders(
			(details, callback) => {
				if (
					details.requestHeaders["User-Agent"] &&
					details.requestHeaders["Origin"] ===
						"https://accounts.google.com"
				) {
					details.requestHeaders["User-Agent"] = "Chrome";
				}
				callback({
					cancel: false,
					requestHeaders: details.requestHeaders,
				});
			}
		);

		createWindow();
	});

	app.on("window-all-closed", () => app.quit());
}
