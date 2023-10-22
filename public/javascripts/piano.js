const root = document.getElementById('root');
const canvas = document.getElementById('piano');
const ctx = canvas.getContext('2d');
const audio = root.querySelectorAll('audio');

const arr = ["red", "orange", "yellow", "green", "blue", "navy", "violet"];
const arr1 = ["도", "레", "미", "파", "솔", "라", "시"];

function rectangle(x,y){
    ctx.fillStyle = x
    ctx.fillRect(y, 0, 100, 500);
}

function pianoBorder (){
for (let i = 0; i < 7; i++) {
    rectangle("black",i*100)
    ctx.clearRect(i*100+1,1,98,498)
}};

pianoBorder();

function fadeOutRectangle(x, y, w, h, r, g, b) {
    var steps = 15,
        dr = (255 - r) / steps,
        dg = (255 - g) / steps,
        db = (255 - b) / steps,
        i = 0,
        interval = setInterval(function() {
            ctx.fillStyle = 'rgb(' + Math.round(r + dr * i) + ','
                                   + Math.round(g + dg * i) + ','
                                   + Math.round(b + db * i) + ')';
            ctx.fillRect(x, y, w, h);
            i++;
            if(i === steps) {
                clearInterval(interval);
            }
        }, 30);
}

canvas.addEventListener('click', (e) => {
    let clickX = e.clientX - ctx.canvas.offsetLeft;
    let j = 1;
    for (let i = 0; i < arr1.length; i++) {
        if (i < clickX && clickX < (i + 1) * 100) {
            audio[i].play()
            fadeOutRectangle(i*100+1, 1, 98, 498, 0, 0, 0);
            return;
        }
    }
})