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
            var newElement = document.createElement("a");
            var newContent = document.createTextNode(name.date + ' (id:' + name.datafileID + ')');
            newElement.appendChild(newContent);
            newElement.href = './main.html?filenameID=' + name.datafileID;
            newElement.style.display = 'block';
            body.appendChild(newElement);

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