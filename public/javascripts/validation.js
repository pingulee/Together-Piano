const idCheck = (value) => {
  if (typeof (value) === "string") {
    let valueArr = [];
    valueArr = [...value];

    let upperValue = value.toUpperCase();
    let upperArr = [];
    upperArr = [...upperValue];

    let lowerValue = value.toLowerCase();
    let lowerArr = [];
    lowerArr = [...lowerValue];

    let upperResult = false;
    let lowerResult = false;

    for (let i = 0; i < valueArr.length; i++) {
      if (valueArr[i] === upperArr[i]) {
        upperResult = true;
        break;
      }
    }
    for (let i = 0; i < valueArr.length; i++) {
      if (valueArr[i] === lowerArr[i]) {
        lowerResult = true;
        break;
      }
    }

    if (upperResult === true && lowerResult === true) {
      return true;
    } else {
      return false;
    }
  }
};

const pwCheck = (pw1, pw2) => {
  if (typeof (pw1) === "string" && typeof (pw2) === "string") {
    if (pw1.localeCompare(pw2) === 0) {
      return true;
    } else {
      console.log('비밀번호가 다릅니다.');
      return false
    }
  }
};

const emailCheck = (value) => {
  let result = false;

  if (typeof (value) === "string") {
    let valueArr = [...value].map(x => x.charCodeAt());
    let atSignUni = "@".charCodeAt();
    let dotUni = ".".charCodeAt();
    let newArr = [];

    for (let i = 0; i < valueArr.length; i++) {
      if (valueArr[i] === atSignUni) {
        newArr = valueArr.slice(i + 1);
        break;
      }
    }
    newArr.map(x => {
      if (x === dotUni) {
        return result = true;
      }
    });
  }
  return result;
};

module.exports = { idCheck, pwCheck, mailCheck };