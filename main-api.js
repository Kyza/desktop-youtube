const { ipcMain, app } = require("electron");
const fs = require("fs");
const path = require("path");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
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
		const videoInfo = ytdl.chooseFormat(info.formats, {
			quality: "highestvideo",
			filter: "videoonly",
		});
		// const audioInfo = ytdl.chooseFormat(info.formats, {
		// 	quality: "highestaudio",
		// 	filter: "audioonly",
		// });

		const videoPartPath = path.join(
			require("os").homedir(),
			sanitizeFilename(`${info.videoDetails.title}.videopart`)
		);
		const audioPartPath = path.join(
			require("os").homedir(),
			sanitizeFilename(`${info.videoDetails.title}.audiopart`)
		);
		const videoFinalPath = path.join(
			require("os").homedir(),
			sanitizeFilename(
				`${info.videoDetails.title}.${videoInfo.container}`
			)
		);

		// Download the highest quality video and the highest quality audio.
		const downloads = [
			ytdl(id, {
				quality: "highestvideo",
				filter: "videoonly",
			}).pipe(fs.createWriteStream(videoPartPath)),
			ytdl(id, {
				quality: "highestaudio",
				filter: "audioonly",
			}).pipe(fs.createWriteStream(audioPartPath)),
		];

		let dlps = [];
		for (const download of downloads) {
			dlps.push(
				new Promise((resolve) => {
					download.on("finish", resolve);
				})
			);
		}

		Promise.all(dlps).then(() => {
			ffmpeg()
				.input(videoPartPath)
				.input(audioPartPath)
				.on("end", function () {
					fs.unlink(videoPartPath, () => {});
					fs.unlink(audioPartPath, () => {});
					console.log("Done processing!");
				})
				.save(videoFinalPath);
			console.log("Done downloading!");
		});
	}
});
