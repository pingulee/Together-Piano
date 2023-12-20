const piano = document.getElementById("piano-keyboard");

const base = "./audio/";

const whiteContainer = document.querySelector(".white-container");
const blackContainer = document.querySelector(".black-container");

// Function to create a white key
function createWhiteKey() {
  const whiteKey = document.createElement("div");
  whiteKey.classList.add("white-key");
  whiteContainer.appendChild(whiteKey);
}

// Function to create a black key
function createBlackKey() {
  const blackKey = document.createElement("div");
  blackKey.classList.add("black-key");
  blackContainer.appendChild(blackKey);
}

// Create 36 white keys
for (let i = 0; i < 52; i++) {
  createWhiteKey();
}

// Create 52 black keys
for (let i = 0; i < 36; i++) {
  createBlackKey();
}

// for (let index = 1; index <= 88; index++) {
//   const div = document.createElement("div");
//   div.classList.add("key", index <= 36 ? "black-key" : "white-key");
//   const number = index <= 9 ? "0" + index : index;
//   div.addEventListener("click", () => {
//     new Audio(`${base}key${number}.mp3`).play();
//   });
//   piano.appendChild(div);
// }
