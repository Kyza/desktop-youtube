<script>
</script>

<style>
	#titlebar {
		width: 100%;
		height: 100%;
		-webkit-app-region: drag;
		grid-row: 1 / 1;
		grid-column: 1 / span 2;

		background-color: #101010;

		padding: 5px;
	}

	#wordmark {
		display: inline-block;
		height: 100%;
		color: #ddd;
		font-weight: bold;
	}

	#titlebar .button {
		float: right;
		height: 100%;
		margin-left: 8px;
		fill: #ddd;
		cursor: pointer;
		-webkit-app-region: none;
	}

	#minimize-button {
		background-color: yellow;
	}
	#maximize-button {
		background-color: green;
	}
	#restore-button {
		background-color: blue;
	}
	#close-button {
		background-color: red;
	}
</style>

<div id="titlebar">
	<div id="wordmark">Desktop YouTube</div>
	<div id="minimize-button" class="button" />
	<div id="restore-button" class="button" />
	<div id="maximize-button" class="button" />
	<div id="close-button" class="button" />
</div>
