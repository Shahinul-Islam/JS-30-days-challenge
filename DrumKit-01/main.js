const mainContainer = document.getElementById("mainContainer");
const keyContainer = document.querySelector(".key-container");
const text = document.querySelector(".text");
const inputField = document.getElementById("userInput");
const loadingDiv = document.querySelector(".loading");
const typingSpeedP = document.querySelector(".typingSpeed p");
const submitButton = document.querySelector(".typing-box button");
// console.log(submitButton);

document.addEventListener("DOMContentLoaded", function () {
	document.onreadystatechange = function () {
		if (document.readyState !== "complete") {
			loadingDiv.style.display = "block";
		} else {
			loadingDiv.style.display = "none";
			mainContainer.style.display = "block";
		}
	};
});

document.onreadystatechange = function () {
	if (document.readyState === "complete") {
		clearInterval(loadingInterval);
		loadingDiv.parentNode.removeChild(loadingDiv);
	}
};

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

const paragraph = document.createElement("p");
paragraph.setAttribute("id", "paragraph");

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

		let startTime = [];
		let endTime;

		inputField.addEventListener("input", function () {
			const userInput = inputField.value;

			if (userInput) {
				startTime.push(new Date().getTime());
				// console.log(startTime[0]);
			}

			let charactersTyped = 0;
			const spans = paragraph.querySelectorAll("span");

			for (let i = 0; i < spans.length; i++) {
				if (i < userInput.length) {
					charactersTyped += 1;
					if (userInput[i] === paragraphText[i]) {
						spans[i].classList.remove("incorrect");
					} else {
						spans[i].classList.add("incorrect");
					}
				} else {
					spans[i].classList.remove("incorrect");
				}
			}
			const grossWPM = Math.round(charactersTyped / 5);
			// let wpm = grossWPM / 2;
			// console.log(wpm);
			submitButton.addEventListener("click", function () {
				const submitTime = new Date().getTime();
				const totalTime = Math.round(((submitTime - startTime[0]) / 1000) * 60);
				console.log(grossWPM, totalTime);
				const userWPM = Math.round(grossWPM / totalTime);

				typingSpeedP.innerHTML = `Typing Speed: ${userWPM} wpm`;
			});
		});
	});
