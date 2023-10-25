const keys = document.querySelectorAll('.key');
const c5 = document.getElementById('c5');

const sustainPedal = document.getElementById('sustain-pedal');
let isSustainOn = false;

keys.forEach(key => {
  const _note = key.getAttribute('data-note');
  key.addEventListener('mousedown', () => {
    console.log(note);
    _note.play();
  });

  key.addEventListener('mouseup', () => {
    _note.pause();
    _note.currentTime = 0;
  });

  key.addEventListener('mouseout', () => {
    _note.pause();
    _note.currentTime = 0;
  });

  key.style.backgroundColor = 'green';
  setTimeout(() => {
    key.style.backgroundColor = key.classList.contains('white') ? 'white' : 'black';
  }, 100);
});