const keyContainer = document.querySelector(".key-container");
const text = document.querySelector(".text");
const inputField = document.getElementById("userInput");
const loadingDiv = document.querySelector(".loading");

document.addEventListener("DOMContentLoaded", function () {
	document.onreadystatechange = function () {
		if (document.readyState !== "complete") {
			loadingDiv.style.display = "block";
			inputField.style.display = "none";
		} else {
			loadingDiv.style.display = "none";
			inputField.style.display = "block";
		}
	};
});

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

		if (currentAudio && !currentAudio.paused) {
			currentAudio.pause();
			currentAudio.currentTime = 0;
		}

		keyPad.classList.add("key-pad-effect");
		currentAudio = new Audio(`./assets/audio/${key}.mp3`);
		currentAudio.play().catch((error) => {
			console.error("Error playing audio:", error);
		});

		setTimeout(function () {
			keyPad.classList.remove("key-pad-effect");
			isAnimating = false;
		}, 300);
	}
});

// Generate paragraph from sentences.json

const paragraph = document.createElement("p");
paragraph.setAttribute("id", "paragraph");

let paragraphText = "";

fetch("./assets/sentences.json")
	.then((res) => res.json())
	.then((data) => {
		data.map((item) => {
			paragraphText = item.text;
			paragraph.innerHTML = paragraphText
				.split("")
				.map((char) => `<span>${char}</span>`)
				.join("");
			text.appendChild(paragraph);
		});

		//check if the typed charact right or wrong

		inputField.addEventListener("input", function () {
			const userInput = inputField.value;
			const spans = paragraph.querySelectorAll("span");

			for (let i = 0; i < spans.length; i++) {
				if (i < userInput.length) {
					if (userInput[i] === paragraphText[i]) {
						spans[i].classList.remove("incorrect");
					} else {
						spans[i].classList.add("incorrect");
					}
				} else {
					spans[i].classList.remove("incorrect");
				}
			}
		});
	});
