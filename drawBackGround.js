//main.jsで、window.onload時に実行される
function drawBackground() {
    //index.htmlにある要素、全て取得
    var body = document.getElementById("body");
    var backPaper = document.getElementById("backPaper");
    var buttom = document.getElementById("buttom");

    var canvas = document.getElementById('perspective');
    var ctx = canvas.getContext('2d');

    console.log(canvas.height);
    var centerX = canvas.width / 2;
    var width = canvas.width;


    // 線の基本スタイル
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;

    ctx.beginPath();

    a = 4;
    b = 1;
    for (i = 0; i < 1000; i++) {
        ctx.moveTo(centerX, 0);
        ctx.lineTo(width * 0, canvas.height * (1 - b / a));
        a += 1;
        b += 1;
    }
    ctx.moveTo(centerX, 0);
    ctx.lineTo(width * 0, canvas.height);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(width * (1 / 6), canvas.height);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(width * (2 / 6), canvas.height);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(width * (3 / 6), canvas.height);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(width * (4 / 6), canvas.height);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(width * (5 / 6), canvas.height);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(width * (6 / 6), canvas.height);
    a = 4;
    b = 1;
    for (i = 0; i < 1000; i++) {
        ctx.moveTo(centerX, 0);
        ctx.lineTo(width, canvas.height * (1 - b / a));
        a += 1;
        b += 1;
    }

    a = 4;
    b = 1;
    for (i = 0; i < 1000; i++) {
        ctx.moveTo(0, canvas.height * (1 - b / a));
        ctx.lineTo(width, canvas.height * (1 - b / a));
        a += 1;
        b += 1;
    }

    ctx.closePath();
    ctx.stroke();

    console.log('finish draw background!');
};