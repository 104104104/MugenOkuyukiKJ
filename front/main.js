var body = document.getElementById("body");
var backPaper = document.getElementById("backPaper");
var buttom = document.getElementById("buttom");
var cursorImg = document.getElementById("cursorImg");
var canvas = document.getElementById('perspective');

var tags = []

let nowdatafile;

var DRUG_FLUG = false;

//計算量を減らすため、メモリ上に置いておく
var DRUG_NOW_TAG;

//付箋の重なり順を指定するグローバル変数
var MAX_ZINDEX = 0;

const MAXIMAM_ZINDEX = 2147483646; //32bitの最大値。絶対に最前面に置きたい要素に使う
cursorImg.style.zIndex = MAXIMAM_ZINDEX;

//SHIFTが押されているかの判定
var SHIFT_DOWN = false;
body.addEventListener("keydown", function(e) {
    SHIFT_DOWN = e.shiftKey;
});
body.addEventListener("keyup", function(e) {
    SHIFT_DOWN = e.shiftKey;
});

// windowのサイズ。この値と実際のwindowのサイズを用いて、付箋の位置を相対的に動かす
const WINDOW_X = 10000;
const WINDOW_Y = 10000;

//マウスの座標
var p = {
    x: 0,
    y: 0,
    diffx: 0,
    diffy: 0,
    updateValue: function(e) { //マウスの座標の更新
        const rect = backPaper.getBoundingClientRect(); //親要素から見た座標を取得する
        newpx = e.clientX - rect.left;
        newpy = e.clientY - rect.top;
        p.diffx = p.x - newpx;
        p.diffy = p.y - newpy;
        p.x = newpx;
        p.y = newpy;

        //カーソルの大きさを変更
        var backPaperH = document.getElementById('backPaper').clientHeight;
        var cursorSize = 80 * (p.y / backPaperH);
        cursorImg.style.left = String(p.x) + 'px';
        cursorImg.style.top = String(p.y) + 'px';
        cursorImg.style.width = String(cursorSize) + 'px';
        cursorImg.style.height = String(cursorSize) + 'px';
        //カーソルを歪ませる
        centerx = p.x + cursorSize / 2;
        centery = p.y + cursorSize / 2;
        degree = -Math.atan((backPaper.clientWidth / 2 - centerx) / centery) * (180 / Math.PI);
        cursorImg.style.transform = 'skew(' + degree + 'deg)';
    }
};

//backPaperのevent処理
backPaper.addEventListener("pointermove", function(e) {
    p.updateValue(e);

    //付箋を動かす処理
    moveDivs = backPaper.getElementsByClassName('drug'); //drugクラスをgetelementする
    for (let moveDiv of moveDivs) { //それを動かす
        //tagを動かす
        try {
            tags[moveDiv.id].moveTag(tags[moveDiv.id].x - p.diffx, tags[moveDiv.id].y - p.diffy);
            console.log(tags[moveDiv.id].madeTime);
        } catch (e) {

        }
    }
});
//backPaperのpointermove ここまで

backPaper.addEventListener('pointerup', function(e) {
    //全てのdivからdrugクラスをなくす
    divs = backPaper.getElementsByClassName('drug');
    for (var div of divs) {
        div.classList.remove('drug');
    }
    //choosedも無くす
    divs = backPaper.getElementsByClassName('choosed');
    for (var div of divs) {
        div.style.zIndex = 0; //背面にないと、文字入力ができなくなる
        div.classList.remove('choosed');
    }
    DRUG_FLUG = false;
    DRUG_NOW_TAG = false;
    postTags();
});


//
// ボタン関連
//
//ボタンの座標の設定
buttom.style.top = String(backPaper.clientHeight - 150) + 'px';
buttom.style.left = String(backPaper.clientWidth - 150) + 'px';
buttom.style.zIndex = MAXIMAM_ZINDEX;
//ウィンドウのリサイズ時、ボタンの位置を変更
window.addEventListener('resize', function() {
    buttom.style.top = String(backPaper.clientHeight - 100) + 'px';
    buttom.style.left = String(backPaper.clientWidth - 100) + 'px';
}, false);

//ボタンが押されたら、付箋の追加
buttom.addEventListener("pointerdown", function(e) {
    //console.log(papers);
    e.preventDefault();
    newTag = makeTag();

    //ボタンを押した直後は、ドラッグ可能状態
    newTag.div().classList.add('drug');
    //ボタンを押した直後は、textareaにフォーカス
    newTag.textarea().focus();
    newTag.textarea().setSelectionRange(newTag.textarea().value.length, newTag.textarea().value.length); //カーソルは、テキストエリアの最後に
    newTag.comeFront();

    DRUG_NOW_TAG = newTag;

    console.log('TAGS', tags);
});


//
// 付箋関連
//

// 画面サイズ上での座標を、絶対座標に変換する関数
function relativePos2AbsolutePos(x,y) {
    return [ WINDOW_X * x / canvas.width, WINDOW_Y * y / canvas.height ];
}

// 絶対座標を、画面サイズ上での座標に変換する関数
function AbsolutePos2relativePos(x,y) {
    return [ x * canvas.width /  WINDOW_X, y * canvas.height /  WINDOW_Y ];
}

//付箋を追加する関数
function makeTag() {
    let newid = String(tags.length);
    let newTagx = p.x - 50;
    let newTagy = p.y - 50;
    let [ab_x, ab_y] = relativePos2AbsolutePos(newTagx, newTagy);
    let newTag = {
        x: newTagx,
        y: newTagy,
        defaultw: 180,
        w: 180, //←defaultwと同じにすること
        h: 120,
        defaultFontsize: 20,
        fontsize: 20, //←defaultFontsizeと同じにすること
        skewx: 0,
        color: 'white',
        str: '',
        id: newid, //jsonのkeyと同じもの
        madeTime: new Date(),

        absolute_x: ab_x,
        absolute_y: ab_y,
    }
    attachTagMethod(newTag);
    tags[newid] = newTag;
    makeHTMLTag(newTag);
    return tags[newid];
}

//tagsに、メソッドを追加する関数
function attachTagMethod(tag) {
    //tagのHTML中のdiv要素を返す関数
    tag.div = function() {
        return document.getElementById(String(this.id));
    };
    //tagのHTML中のtextarea要素を返す関数
    tag.textarea = function() {
        return document.getElementById('tag' + String(this.id) + 'textarea');
    };
    //tagを最前面に移動する関数
    tag.comeFront = function() {
        tempDiv = document.getElementById(String(this.id));
        tempDivColor = tempDiv.firstElementChild;
        tempTextarea = document.getElementById('tag' + String(this.id) + 'textarea');
        tempDiv.style.zIndex = MAX_ZINDEX + 2;
        tempDivColor.style.zIndex = MAX_ZINDEX + 1;
        tempTextarea.style.zIndex = MAX_ZINDEX;
        MAX_ZINDEX += 3;
    };
    //tagを歪ませる関数
    tag.skewxfunction = function() {
        centerx = this.x + this.w / 2;
        centery = this.y + this.h / 2;
        degree = -Math.atan((backPaper.clientWidth / 2 - centerx) / centery) * (180 / Math.PI);
        htmldiv.style.transform = 'skew(' + degree + 'deg)';
        this.skewx = degree;
    };
    //tagをx,yに動かす関数
    tag.moveTag = function(x, y) {
        htmldiv = tag.div();
        htmltextarea = tag.textarea();
        //x,yの移動
        htmldiv.style.top = String(y) + 'px';
        htmldiv.style.left = String(x) + 'px';
        this.x = x;
        this.y = y;
        //w,hの変更
        var backPaperH = document.getElementById('backPaper').clientHeight;
        var tempW = tag.defaultw * (1 - (backPaperH - y) / (backPaperH));
        htmldiv.style.width = String(tempW + 6) + 'px'; //なぜか、6textareaより小さいので、足す
        htmldiv.style.height = String(tempW * (2 / 3) + 6) + 'px'; //なぜか、6textareaより小さいので、足す
        htmltextarea.style.width = String(tempW) + 'px';
        htmltextarea.style.height = String(tempW * (2 / 3)) + 'px';
        this.w = tempW;
        this.h = tempW * (2 / 3);
        //fontsizeの変更
        var newFontsize = tag.defaultFontsize * (1 - (backPaperH - y) / (backPaperH));
        if (newFontsize > 0) {
            htmltextarea.style.fontSize = String(newFontsize) + 'px';
        }
        this.fontsize = newFontsize;

        this.skewxfunction();
    };
}

//HTMLのtagを描画する
function makeHTMLTag(tag) {
    //付箋のhtml要素を追加する
    var div = document.createElement('div');
    var divColor = document.createElement('div');
    var textarea = document.createElement('textarea');

    //textareaは直接クリック不可
    textarea.addEventListener("pointerdown", function(e) {
        e.preventDefault();
    });

    //textarea内部の文字は、ドラッグで選択不可
    textarea.onselectstart = function() {
        return false;
    }

    //divをクリックされたら、
    div.addEventListener("pointerdown", function(e) {
        //textareaの編集を開始する
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length); //カーソルは、テキストエリアの最後に

        //付箋を動かすための処理
        div.classList.add('drug');
        div.firstChild.classList.add('choosed');
        //SHIFT時、頂点のどれかが、今クリックしているtagの下にあるtagも、動かす
        console.log(SHIFT_DOWN);
        if (SHIFT_DOWN) {
            for (let onetag of tags) {
                v1 = { x: onetag.x, y: onetag.y };
                v2 = { x: onetag.x + onetag.w, y: onetag.y };
                v3 = { x: onetag.x + onetag.w, y: onetag.y + onetag.h };
                v4 = { x: onetag.x, y: onetag.y + onetag.h };
                if (tag.x <= v1.x && v1.x <= tag.x + tag.w && tag.y <= v1.y && v1.y <= tag.y + tag.h) {
                    onetag.div().classList.add('drug');
                    onetag.div().firstChild.classList.add('choosed');
                }
                if (tag.x <= v2.x && v2.x <= tag.x + tag.w && tag.y <= v2.y && v2.y <= tag.y + tag.h) {
                    onetag.div().classList.add('drug');
                    onetag.div().firstChild.classList.add('choosed');
                }
                if (tag.x <= v3.x && v3.x <= tag.x + tag.w && tag.y <= v3.y && v3.y <= tag.y + tag.h) {
                    onetag.div().classList.add('drug');
                    onetag.div().firstChild.classList.add('choosed');
                }
                if (tag.x <= v4.x && v4.x <= tag.x + tag.w && tag.y <= v4.y && v4.y <= tag.y + tag.h) {
                    onetag.div().classList.add('drug');
                    onetag.div().firstChild.classList.add('choosed');
                }
            }
            SHIFT_DOWN = false;
        }


        //最前面へ
        tag.comeFront();

        //DRUG_NOW_TAGを更新
        DRUG_NOW_TAG = tag;

        //DRUGFLUGをtrueに
        DRUG_FLUG = true;
    });

    //複数選択時の挙動をよくするための、pointerup
    div.addEventListener('pointerup', function(e) {
        //全てのdivからdrugクラスをなくす
        divs = backPaper.getElementsByClassName('drug');
        for (var div of divs) {
            div.classList.remove('drug');
        }
        //choosedも無くす
        divs = backPaper.getElementsByClassName('choosed');
        for (var div of divs) {
            div.style.zIndex = 0; //背面にないと、文字入力ができなくなる
            div.classList.remove('choosed');
        }
        DRUG_FLUG = false;
        DRUG_NOW_TAG = false;
        postTags();
    });
    divColor.addEventListener('pointerup', function(e) {
        //全てのdivからdrugクラスをなくす
        divs = backPaper.getElementsByClassName('drug');
        for (var div of divs) {
            div.classList.remove('drug');
        }
        //choosedも無くす
        divs = backPaper.getElementsByClassName('choosed');
        for (var div of divs) {
            div.style.zIndex = 0; //背面にないと、文字入力ができなくなる
            div.classList.remove('choosed');
        }
        DRUG_FLUG = false;
        DRUG_NOW_TAG = false;
        postTags();
    });
    textarea.addEventListener('pointerup', function(e) {
        //全てのdivからdrugクラスをなくす
        divs = backPaper.getElementsByClassName('drug');
        for (var div of divs) {
            div.classList.remove('drug');
        }
        //choosedも無くす
        divs = backPaper.getElementsByClassName('choosed');
        for (var div of divs) {
            div.style.zIndex = 0; //背面にないと、文字入力ができなくなる
            div.classList.remove('choosed');
        }
        DRUG_FLUG = false;
        DRUG_NOW_TAG = false;
        postTags();
    });

    //divの詳細設定
    div.setAttribute("id", tag.id);
    div.style.position = 'absolute';
    div.style.top = String(tag.y) + 'px';
    div.style.left = String(tag.x) + 'px';
    div.style.width = String(tag.w + 6) + 'px'; //なぜか、textareaの方が6px大きいので、6足す
    div.style.height = String(tag.h + 6) + 'px'; //なぜか、textareaの方が6px大きいので、6足す
    div.style.transform = 'skew(' + String(tag.skewx) + 'deg)';
    //div.style.cursor = 'none';

    divColor.style.position = 'absolute';
    divColor.style.width = '100%';
    divColor.style.height = '100%';


    //textareaの詳細設定
    textarea.setAttribute("id", "tag" + tag.id + "textarea");
    textarea.style.position = 'absolute';
    textarea.style.top = '0px';
    textarea.style.left = '0px';
    textarea.style.width = String(tag.w) + 'px';
    textarea.style.height = String(tag.h) + 'px';
    textarea.style.fontSize = String(tag.fontsize) + 'px';
    textarea.style.resize = 'none';
    textarea.value = tag.str;
    textarea.style.cursor = 'none';

    //textareaに文字が入力されるたび、tagsに保存し、サーバーに送信
    textarea.addEventListener('keyup', e => {
        //該当するtags変数の、strを上書きする
        tags[tag.id].str = textarea.value;
        postTags();
    });
    backPaper.appendChild(div);
    div.appendChild(divColor);
    div.appendChild(textarea);
}

function getTagByID(id) {
    for (let t of tags) {
        if (t.id == id) {
            return t;
        }
    }
}

function getDrugNowTag() {
    return DRUG_NOW_TAG;
}



//
// POST・GET関連のコード
//

//付箋のデータをサーバーに送る関数
function postTags() {
    //tagsをjsonにする
    json_tags = JSON.stringify(tags);

    //Pythonサーバーにjsonを送る
    let formData = new FormData();
    formData.append('param', json_tags);
    formData.append('chooseData', nowdatafile);
    formData.append('MAX_ZINDEX', MAX_ZINDEX);

    let url = 'http://0.0.0.0:8401/post'
    let response = fetch(url, {
        method: 'POST',
        body: formData,
    });
}

//画面の読み込み時に、tagのデータをGETしてくる
window.onload = (event) => {
    console.log('page is fully loaded');
    //var params = (new URL(document.location)).searchParams;
    //nowdatafile = params.get('filenameID');
    console.log((new URL(document.location)).searchParams.get('filenameID'));
    //nowdatafile = 'data/Matomeru'
    nowdatafile = (new URL(document.location)).searchParams.get('filenameID');
    console.log(nowdatafile);
    drawBackground();
    get_tags();
};

function get_tags() {
    url = 'http://0.0.0.0:8401/get';

    //URLにnowdatafileを引数として追加する
    let url_obj = new URL(url);
    let params = new URLSearchParams();
    params.append('datafileID', nowdatafile);
    url_obj.search = params.toString();

    fetch(url_obj.toString(), {
            method: 'GET',
        }, )
        .then(function(response) {
            return response.text();
        })
        .then(function(text) {
            getdata = JSON.parse(text);

            temp = getdata.pop(getdata.length); //MAX_ZINDEXは、配列の最後に入っている
            MAX_ZINDEX = temp['MAX_ZINDEX'];

            //tagsに、GETデータを代入
            tags = getdata;

            //tagsをHTMLとして表示する
            for (let tag of tags) {
                attachTagMethod(tag);
                makeHTMLTag(tag);
            }
        });
}