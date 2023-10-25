document.addEventListener('DOMContentLoaded', function () {
  // 모든 피아노 키 엘리먼트를 가져옵니다.
  const pianoKeys = document.querySelectorAll('.key');
  const playingNotes = {}; // 재생 중인 음을 추적하기 위한 객체

  // 피아노 키를 클릭했을 때의 이벤트 핸들러를 등록합니다.
  pianoKeys.forEach(function (key) {
    key.addEventListener('mousedown', function () {
      // 클릭한 피아노 키의 data-note 속성 값을 가져옵니다.
      const note = key.getAttribute('data-note');
      
      // 해당하는 오디오 엘리먼트를 찾아서 재생합니다.
      const audioElement = document.getElementById(note);
      if (audioElement) {
        audioElement.currentTime = 0; // 오디오를 처음으로 되감습니다.
        audioElement.play(); // 오디오 재생

        // 재생 중인 음을 추적합니다.
        playingNotes[note] = audioElement;
      }

      // 배경 색상 변경
      key.style.backgroundColor = 'lightgray'; // 변경할 배경 색상을 지정합니다.
    });

    key.addEventListener('mouseup', function () {
      // 마우스를 뗐을 때 배경 색상을 초기화합니다.
      key.style.backgroundColor = '';

      // sustain 기능: 키를 떼도 음을 계속 재생합니다.
      const note = key.getAttribute('data-note');
      const audioElement = playingNotes[note];
      if (audioElement) {
        audioElement.pause(); // 오디오 일시 정지
      }
    });
  });
});