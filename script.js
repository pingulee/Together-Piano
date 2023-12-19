let piano = document.getElementsByClassName("piano-keyboard");
const base = "./audio/";
window.onload = () => {
  for (let index = 1; index <= 88; index++) {
    let div = document.createElement("div");
    div.classList.add("key", index <= 34 ? "black-key" : "white-key");
    const number = index <= 9 ? "0" + index : index;
    div.addEventListener("click", () => {
      new Audio(`${base}key${number}.mp3`).play();
    });
    piano[0].appendChild(div);
  }
};