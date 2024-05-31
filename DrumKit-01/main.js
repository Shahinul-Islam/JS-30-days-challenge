document.addEventListener("DOMContentLoaded", function () {
	const loadingDiv = document.querySelector(".loading");

	document.onreadystatechange = function () {
		if (document.readyState !== "complete") {
			loadingDiv.style.display = "block";
		} else {
			loadingDiv.style.display = "none";
		}
	};
});

document.onreadystatechange = function () {
	if (document.readyState === "complete") {
		clearInterval(loadingInterval);
		loadingDiv.parentNode.removeChild(loadingDiv);
	}
};

const keyContainer = document.querySelector(".key-container");
//fetch data from json
fetch("./assets/data.json")
	.then((res) => res.json())
	.then((data) => {
		data.forEach((key) => {
			const keyPad = document.createElement("div");
			keyPad.classList.add("key-pad");
			keyPad.setAttribute("id", key.key);
			keyPad.innerHTML = `${key.key} <span>${key.name}</span>`;
			keyContainer.appendChild(keyPad);
		});
	});

//play audio
let currentAudio = null;
let isAnimating = false;

document.addEventListener("keyup", function (event) {
	let key = event.key.toUpperCase();
	let keyPad = document.getElementById(key);

	if (keyPad && !isAnimating) {
		isAnimating = true;

		if (currentAudio) {
			currentAudio.pause();
			currentAudio.currentTime = 0;
		}

		keyPad.classList.add("key-pad-effect");
		currentAudio = new Audio(`./assets/audio/${key}.mp3`);
		currentAudio.play();

		setTimeout(function () {
			keyPad.classList.remove("key-pad-effect");
			isAnimating = false;
		}, 300);
	}
});
