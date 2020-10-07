<script>
	import { onMount } from "svelte";
	import store from "./store";
	import Titlebar from "./components/Titlebar.svelte";
	import Sidebar from "./components/Sidebar.svelte";
	import YouTube from "./YouTube";

	let currentTabURL = $store.tabs[$store.currentTab];
	let webview;
	let yt;

	onMount(() => {
		webview.addEventListener(
			"dom-ready",
			() => {
				yt = new YouTube(webview);
				yt.set("page", {
					video: "hQI7hNOVauE",
				});
				setInterval(async () => {
					console.log("URL:", await yt.get("url"));
					console.log("Video:", await yt.get("videoID"));
					console.log("Playlist:", await yt.get("playlistID"));
				}, 1e3);
				webview.openDevTools();
			},
			{ once: true }
		);
	});
</script>

<style>
	main {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-rows: 28px auto;
		grid-template-columns: 48px auto;
	}
</style>

<main>
	<Titlebar />
	<Sidebar />
	<webview
		bind:this={webview}
		id="webview"
		src={currentTabURL}
		preload="../src/youtube-preload/index.js" />
</main>
