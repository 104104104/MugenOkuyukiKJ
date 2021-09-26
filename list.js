var body = document.getElementById("body");

const BASE_LIST_URL = 'http://0.0.0.0:8402';

var NAME_LIST = [];


//読み込み時の動作
window.onload = (event) => {
    let promise = new Promise((resolve, reject) => {
        resolve()
    })

    promise.then(() => {
        //nameListの取得
        return new Promise((resolve, reject) => {
            var getdata;
            url = BASE_LIST_URL + '/get';

            let url_obj = new URL(url);
            fetch(url_obj.toString(), {
                    method: 'GET',
                }, )
                .then(function(response) {
                    return response.text();
                })
                .then(function(text) {
                    getdata = JSON.parse(JSON.parse(text));
                    NAME_LIST = getdata;
                    resolve();
                });
        });
    }).then(() => {
        //HTMLの生成
        var revNameList = NAME_LIST.concat().reverse();
        for (let name of revNameList) {
            var atag = document.createElement("a");

            //日付と曜日を表示する
            dateLi = name.date.split(' ')[0].split('-')
            let weekdate = new Date(String(Number(dateLi[0])), String(Number(dateLi[1]) - 1), dateLi[2]);
            var dayOfWeek = ["(日)", "(月)", "(火)", "(水)", "(木)", "(金)", "(土)"];
            var todayWeek = dayOfWeek[weekdate.getDay()];

            var atagText = document.createTextNode(name.date.split(' ')[0] + todayWeek + ' ' + name.date.split(' ')[1] + ' (id:' + name.datafileID + ')');
            atag.appendChild(atagText);
            atag.href = './main.html?filenameID=' + name.datafileID;
            //atag.style.display = 'block';

            var ptag = document.createElement("p");
            ptag.appendChild(atag);
            ptag.style.marginBottom = '0px';
            ptag.style.paddingBottom = '0px';
            body.appendChild(ptag);

            var textarea = document.createElement('textarea');
            textarea.value = name.memo;
            textarea.style.resize = 'none';
            textarea.style.width = '300px';
            textarea.style.height = '50px';
            textarea.setAttribute("id", 'textarea' + name.datafileID);

            //textareaに文字が入力されるたび、NAME_LISTをサーバーに送信
            textarea.addEventListener('keyup', e => {
                for (let i of NAME_LIST) {
                    if (i.datafileID == name.datafileID) {
                        name.memo = document.getElementById('textarea' + name.datafileID).value;

                        url = BASE_LIST_URL + '/postmemo';
                        let url_obj = new URL(url);

                        //Pythonサーバーにjsonを送る
                        let formData = new FormData();
                        formData.set('param', JSON.stringify(NAME_LIST));
                        fetch(url_obj.toString(), {
                            method: 'POST',
                            body: formData,
                        }, );
                    }
                }
            });
            body.appendChild(textarea);
        }
    }).catch(() => { // エラーハンドリング
        console.error('Something wrong!')
    })
}





//ボタンを押した際の動作
document.getElementById("button").onclick = function() {
    let promise = new Promise((resolve, reject) => {
        console.log('clicked');
        resolve()
    })

    promise.then(() => {
        //addSpaceが押されたことだけ伝える
        return new Promise((resolve, reject) => {
            let url = 'http://0.0.0.0:8402/addSpace'
            let response = fetch(url, {
                method: 'POST',
                body: '',
            });
            resolve();
        });
    }).then(() => {
        //リロード
        location.reload();
    }).catch(() => { // エラーハンドリング
        console.error('Something wrong!')
    })
};