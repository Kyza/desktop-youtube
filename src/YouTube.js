const { ipcRenderer } = require("electron");

function generateID(length) {
	var s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	return Array(length)
		.join()
		.split(",")
		.map(function () {
			return s.charAt(Math.floor(Math.random() * s.length));
		})
		.join("");
}

class YouTube {
	constructor(webview) {
		this.webview = webview;
	}

	async get(value) {
		const id = generateID(10);
		return await new Promise((resolve) => {
			this.webview.addEventListener(
				"ipc-message",
				(event) => {
					const { args, channel } = event;

					if (channel === `reply-${id}`) {
						resolve(args[0]);
					}
				},
				{ once: true }
			);
			this.webview.send(`get-${value}`, { id });
		});
	}

	set(value, data) {
		this.webview.send(`set-${value}`, data);
	}
}

export default YouTube;
