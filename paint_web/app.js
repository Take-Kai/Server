//var btn でbtnタグがついたドキュメントを取得
var btnClear = document.getElementById('btnClear');
var btnSave = document.getElementById('btnSave');
var btnBack = document.getElementById('btnBack');
var btnRed = document.getElementById('btnRed');
var btnBlue = document.getElementById('btnBlue');
var btnSuzuri = document.getElementById('btnSuzuri');
//var canvas でcanvasタグがついたドキュメントを取得
var canvas = document.getElementById('canvas');
//2Dグラフィックを描画するためのメソッドやプロパティをもつオブジェクトを返す
var ctx = canvas.getContext('2d');
var mousex, mousey;
var state = false;
var color = 0;
var alpha = 1.0;
let clickCount = 0;

const STACK_MAX_SIZE = 10;
let undoStack = [];

//描画領域の設定
//canvas.width, canvas.height ：　描画領域
//window.innerWidth, window.innerHeight　：　コンテンツ表示領域（ブラウザのうち、検索欄などを消した範囲）
canvas.width = window.innerWidth - 2;
canvas.height = window.innerHeight - 2;

//線を丸みを帯びた形にする
ctx.lineCap = 'round';

//addEventListenerでイベントを取得
//mousemoveイベントだったらmouseMove関数を呼び出すみたいな感じ

/*
//PCで動作する時
canvas.addEventListener('mousemove', mouseMove);
canvas.addEventListener('mousedown', mouseDown);
canvas.addEventListener('mouseup', mouseUp);
*/

//タブレットで行う時
canvas.addEventListener('touchstart', touchStart);
canvas.addEventListener('touchmove', touchMove);
canvas.addEventListener('touchend', touchEnd);

btnClear.addEventListener('click', clearBtn);
btnSave.addEventListener('click', saveImage);
btnBack.addEventListener('click', undo);
btnRed.addEventListener('click', changeRed);
btnBlue.addEventListener('click', changeBlue)
btnSuzuri.addEventListener('click', inkPlus);


//clearBtn関数
function clearBtn() {
    saveState(); //現在の状態を保存
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function back() {
    history.back();
}

function inkPlus() {
    //clickCount += 1;
    alpha = 1;
}

function changeRed() {
    alert('赤に変わりました');
    ctx.strokeStyle = 'red';
}

function changeBlue() {
    alert('青に変わりました');
    ctx.strokeStyle = 'blue';
}

function saveImage() {
    //キャンバスをURLに変換する
    const dataURL = canvas.toDataURL('image/png');
    //動的なHTMLを作成する
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'canvas_image.png';
    link.click();
}

function saveState() {
    if(undoStack.length >= STACK_MAX_SIZE) {
        undoStack.shift();
    }
    undoStack.push(canvas.toDataURL());
}

function alphaChange() {
    alpha = alpha - 0.0005;
    ctx.globalAlpha = alpha;
    alpha = ctx.globalAlpha;

    if(alpha < 0.05) {
        alpha = 0.05
    }

    //console.log(alpha);

    /*
    if(clickCount == 2) {
        alpha = 1;
        //clickCount = 0;
    }
    clickCount = 0;
    */
    //return alpha;
}

function undo() {
    if(undoStack.length > 0) {
        var previousState = undoStack.pop();
        var img = new Image();
        img.src = previousState;
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        }
    } else {
        alert('これ以上戻る操作はできません');
    }
}

/*
function mouseDown(e) {
    mousex = e.clientX;
    mousey = e.clientY;
    state = true;
    saveState(); //描画開始前に現在の状態を保存
}

function mouseMove(e) {
    if(!state) return;

    //var w = Math.random() * 51;

    //ctx.lineWidth = w;
    ctx.lineWidth = 30;
    setInterval(alphaChange, 200);

    penColor='#000000';
    //ctx.strokeStyle = 'hsl('+color+', 100%, 50%)';
    ctx.beginPath();
    ctx.moveTo(mousex, mousey);
    ctx.lineTo(e.clientX, e.clientY);
    //setInterval(alphaChange, 1000);
    ctx.stroke();

    mousex = e.clientX;
    mousey = e.clientY;
}

function mouseUp() {
    state = false;
}
*/


function touchStart(e) {
    e.preventDefault();
    mousex = e.touches[0].clientX;
    mousey = e.touched[0].clientY;
    state = true;
    saveState();
}

function touchMove(e) {
    e.preventDefault();
    if (!state) return;

    ctx.lineWidth = 30;
    setInterval(alphaChange, 2000);

    ctx.beginPath();
    ctx.moveTo(mousex, mousey);
    ctx.lineTo(e.touches[0].clientX, e.touches[0].clientY);
    ctx.stroke();

    mousex = e.touches[0].clientX;
    mousey = e.touches[0].clientY;
}

function touchEnd() {
    state = false;
}