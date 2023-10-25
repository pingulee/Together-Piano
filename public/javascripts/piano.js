const keys = document.querySelectorAll('.key');
const audio = document.getElementById('audio');
const sustainPedal = document.getElementById('sustain-pedal');
let isSustainOn = false;

keys.forEach(key => {
  key.addEventListener('mousedown', () => {
    const note = key.getAttribute('data-note');
    audio.src = `./sounds/${note}.mp3`;
    audio.play();
  });

  key.addEventListener('mouseup', () => {
    audio.pause();
    audio.currentTime = 0;
  });

  key.addEventListener('mouseout', () => {
    audio.pause();
    audio.currentTime = 0;
  });

  key.style.backgroundColor = 'green';
  setTimeout(() => {
    key.style.backgroundColor = key.classList.contains('white') ? 'white' : 'black';
  }, 100);
});