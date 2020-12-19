var body = document.getElementById("body");

const BASE_LIST_URL = 'http://0.0.0.0:8402';

var NAME_LIST = [];

document.getElementById("button").onclick = function() {
    // ここに#buttonをクリックしたら発生させる処理を記述する
    console.log('clicked');
    let url = 'http://0.0.0.0:8402/addSpace'
    let response = fetch(url, {
        method: 'POST',
        body: '',
    });
};

//読み込み時、ワークスペースのリストを表示
window.onload = (event) => {
    let promise = new Promise((resolve, reject) => {
        console.log('startPromise')
        resolve()
    })

    promise.then(() => {
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
                    resolve(getdata);
                });
        });
    }).then((data) => {
        console.log(data)
        for (let name of data) {
            var newElement = document.createElement("a");
            var newContent = document.createTextNode('表示名:' + name.displayName + ' id:' + name.datafileID);
            newElement.appendChild(newContent);
            newElement.href = './main.html?filenameID=' + name.datafileID;
            newElement.style.display = 'block';
            body.appendChild(newElement);

            //var textarea = document.createElement('textarea');
            //body.appendChild(textarea);
        }
    }).catch(() => { // エラーハンドリング
        console.error('Something wrong!')
    })
}