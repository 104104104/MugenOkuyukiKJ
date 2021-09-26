from flask import Flask, jsonify, abort, make_response, render_template, request
from flask_cors import CORS
import json, os, datetime

HOST = '0.0.0.0'
PORT = 8402

api = Flask(__name__)
CORS(api)  # CORS有効化

#window読み込み時の動作
@api.route('/get', methods=['GET'])  # Getだけ受け付ける
def get():
    result = ''
    fileName='./data/nameList.json'

    #nameListを読み込み
    with open(fileName, mode='r') as f:
        result += f.read()
    #resultAndMaxzindex=json.loads(result)

    ret = json.dumps(result)
    return ret

#ボタンが押された時の動作
#ディレクトリを生成
@api.route('/addSpace', methods=['POST'])
def addSpace():
    print('coming')

    #nameListを読み込み
    result = ''
    fileName='./data/nameList.json'
    with open(fileName, mode='r') as f:
        result += f.read()

    ret = json.loads(result)
    newID = len(ret)
    ret.append({'date':str(datetime.datetime.today()), 'memo':'', 'datafileID': str(len(ret)) })

    with open(fileName, mode='w') as f:
        f.write(json.dumps(ret) + "\n")

    os.mkdir('./data/'+str(newID))
    print(len(ret))
    print(result)
    #os.mkdir('./test')
    return True

#textareaに文字を入力した時の動作
@api.route('/postmemo', methods=['POST'])  # Postだけ受け付ける
def post():
    result = request.form["param"]  # Postで送ったときのパラメータの名前を指定する
    print(result)
    #tagsの保存
    SaveFileName = './data/nameList.json'
    with open(SaveFileName, mode='w') as f:
        f.write(result + "\n")

    return make_response(result)

# 8402番ポートでWebサーバを起動する
if __name__ == '__main__':
    api.run(host=HOST, port=PORT, debug=True)