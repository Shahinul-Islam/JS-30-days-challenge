document.addEventListener("keydown", function (event) {
	let key = event.key;
	console.log(event);
	document.getElementById(`${key}`).classList.add("key-pad-effect");
	setTimeout(function () {
		document.getElementById(`${key}`).classList.remove("key-pad-effect");
	}, 100);
	new Audio(`/assets/audio/${key}.mp3`).play();
});
