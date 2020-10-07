import { writable } from "svelte/store";

export default writable({
	tabs: ["https://youtube.com/"],
	currentTab: 0,
});
