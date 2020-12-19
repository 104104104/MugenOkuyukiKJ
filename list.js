var body = document.getElementById("body");

const BASE_LIST_URL = 'http://0.0.0.0:8402';

var NAME_LIST = [];

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
        console.log(name)
        var newElement = document.createElement("p"); // p要素作成
        var newContent = document.createTextNode(name.displayName); // テキストノードを作成
        newElement.appendChild(newContent); // p要素にテキストノードを追加

        body.appendChild(newElement);
    }
}).catch(() => { // エラーハンドリング
    console.error('Something wrong!')
})


/*
var getSpaceList = function() {
    return new Promise(function() {
        var getdata;
        url = BASE_LIST_URL + '/get';

        //URLにnowdatafileを引数として追加する
        let url_obj = new URL(url);
        fetch(url_obj.toString(), {
                method: 'GET',
            }, )
            .then(function(response) {
                return response.text();
            })
            .then(function(text) {
                getdata = JSON.parse(text);
                NAME_LIST = getdata;
                return getdata;
            });
    });
};

var makeHTMLList = function(nameList) {
    return new Promise(function(namelist) {
        for (let name of namelist) {
            var newElement = document.createElement("p"); // p要素作成
            var newContent = document.createTextNode(name.displayTitle); // テキストノードを作成
            newElement.appendChild(newContent); // p要素にテキストノードを追加

            body.appendChild(newElement);
        }
    });
};



//画面の読み込み時に、ファイル名の一覧を取得する
window.onload = (event) => {
    console.log('page is fully loaded');
    ret = getSpaceList();
    //nameList = getSpaceList();
    //console.log(nameList);
    console.log('ret', ret);

    console.log('before', NAME_LIST);

    getSpaceList().then(makeHTMLList(NAME_LIST));
};
*/