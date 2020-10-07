const { ipcMain, app } = require("electron");
const fs = require("fs");
const path = require("path");
const ytdl = require("ytdl-core");
const sanitize = require("sanitize-filename");

function sanitizeFilename(filename) {
	return sanitize(filename).replace(/_{2,}/gi, "_");
}

ipcMain.on("quit", (event, arg) => {
	console.log("Quitting...");
	app.quit();
});

ipcMain.on("update-settings", (event, arg) => {
	console.log(arg);
});

ipcMain.on("youtube-navigate", (event, args) => {
	console.log(args);
});

ipcMain.on("download-video", async (event, arg) => {
	const id = arg;

	if (ytdl.validateID(id)) {
		const info = await ytdl.getInfo(id);
		const videoFormatInfo = ytdl.chooseFormat(info.formats, {
			quality: "highest",
		});

		const videoPath = path.join(
			require("os").homedir(),
			sanitizeFilename(
				`${info.videoDetails.title}.${videoFormatInfo.container}`
			)
		);

		ytdl(id, {
			quality: "highest",
		})
			.on("finish", () => {
				console.log("Done downloading!");
			})
			.pipe(fs.createWriteStream(videoPath));
	}
});
