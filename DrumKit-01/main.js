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
// Fetch data from JSON
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

// Play audio
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

// Generate paragraph from sentences.json
const text = document.querySelector(".text");
const paragraph = document.createElement("p");
paragraph.setAttribute("id", "paragraph");
const inputField = document.getElementById("userInput");
let paragraphText = "";

fetch("./assets/sentences.json")
	.then((res) => res.json())
	.then((data) => {
		data.map((sentence) => {
			paragraphText = sentence.text;
			paragraph.innerHTML = paragraphText
				.split("")
				.map((char) => `<span>${char}</span>`)
				.join("");
		});

		text.appendChild(paragraph);

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
