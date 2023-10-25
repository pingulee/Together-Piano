const pianoKeys = document.querySelectorAll('.key');

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
      }

      // 배경 색상 변경
      key.style.backgroundColor = 'lightgray'; // 변경할 배경 색상을 지정합니다.
    });

    key.addEventListener('mouseup', function () {
      // 마우스를 뗐을 때 배경 색상을 초기화합니다.
      key.style.backgroundColor = '';
    });
  });