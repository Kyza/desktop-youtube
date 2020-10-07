const fs = require("fs");
const path = require("path");
const { ipcRenderer } = require("electron");

function sendReply(id, data) {
	ipcRenderer.sendToHost(`reply-${id}`, data);
}

ipcRenderer.on("get-videoID", (event, data) => {
	sendReply(data.id, new URLSearchParams(window.location.search).get("v"));
});

ipcRenderer.on("get-playlistID", (event, data) => {
	sendReply(data.id, new URLSearchParams(window.location.search).get("list"));
});

ipcRenderer.on("get-url", (event, data) => {
	sendReply(data.id, window.location.href);
});
ipcRenderer.on("set-url", (event, data) => {
	window.location.href = data;
});

ipcRenderer.on("set-page", (event, data) => {
	let url = `https://www.youtube.com/`;
	const urlParams = new URLSearchParams("");

	if (data.channel) {
		return (window.location.href = `${url}channel/${data.channel}`);
	} else if (data.playlist && !data.video) {
		url += "playlist";
	} else {
		url += "watch";
	}

	if (data.video) {
		urlParams.set("v", data.video);
	}
	if (data.playlist) {
		urlParams.set("list", data.playlist);
	}
	window.location.href = `${url}?${urlParams.toString()}`;
});

function injectCSS() {
	const cssElement = document.createElement("style");
	cssElement.textContent = fs.readFileSync(
		path.join(__dirname, "/index.css")
	);
	cssElement.id = "dyt-css";
	document.head.appendChild(cssElement);
}

function addRightControls() {
	let tmpInterval = setInterval(() => {
		let rightControls = document.querySelector(".ytp-right-controls");
		if (rightControls) {
			clearInterval(tmpInterval);
			const button = require("./components/download-button");
			button.onclick = () => {
				ipcRenderer.send(
					"download-video",
					new URLSearchParams(window.location.search).get("v")
				);
			};
			rightControls.insertBefore(button, rightControls.firstChild);
		}
	}, 1e2);
}

window.onload = () => {
	injectCSS();
	addRightControls();

	function callback(mutationsList, observer) {
		for (const mutation of mutationsList) {
			if (mutation.type === "childList") {
				for (const node of mutation.addedNodes) {
					// Inject right controls.
					if (node.className === "ytp-right-controls") {
						addRightControls();
					}
				}
			}
		}
	}

	const observer = new MutationObserver(callback);
	// observer.observe(document.body, {
	// 	childList: true,
	// 	subtree: true,
	// });
};
