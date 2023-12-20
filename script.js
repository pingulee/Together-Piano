let piano = document.getElementById("piano-keyboard");


let pianoWidth = piano.clientWidth;
let pianoHeight = piano.clientHeight;

const base = "./audio/";

for (let index = 1; index <= 88; index++) {
  let div = document.createElement("div");
  div.classList.add("key", index <= 36 ? "black-key" : "white-key");
  const number = index <= 9 ? "0" + index : index;
  div.addEventListener("click", () => {
    new Audio(`${base}key${number}.mp3`).play();
  });
  piano.appendChild(div);
}