const one = `
<!DOCTYPE html>
<html lang="ko">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Success</title>
  <link rel="stylesheet" href="./css/style.css">
</head>

<body>
  <div id="root" class="box-Main">
    <form method="post" action="/send">
      <div class="box">
        <h2><span id="nameID">`;
        
        
const two = `
</span>님 받갑습니다.</h2>
      </div>
      <div class="box">
        <label for="txt-Title" class="lbl">Title</label>
        <input type="text" name="title" id="txt-Title" class="txt">
      </div>
      <div class="box">
        <label for="txt-Text" class="lbl">Text</label>
        <textarea name="text" id="txt-Text" class="txt"></textarea>
      </div>
      <div class="box">
        <div>

        </div>
        <div>
          <input type="submit" value="전송" id="btn-send" class="hotpink"></input>
        </div>
      </div>
    </form>
  </div>
</body>

</html>
`;

module.exports = {one, two};