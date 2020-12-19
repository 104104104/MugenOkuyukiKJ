from flask import Flask, jsonify, abort, make_response, render_template, request
from flask_cors import CORS
import json

HOST = '0.0.0.0'
PORT = 8402

api = Flask(__name__)
CORS(api)  # CORS有効化

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

@api.route('/post', methods=['POST'])  # Postだけ受け付ける
def post():
    result = request.form["param"]  # Postで送ったときのパラメータの名前を指定する
    dataid = request.form["chooseData"]
    max_zindex = request.form["MAX_ZINDEX"]
    
    #tagsの保存
    SaveFileName = './'+dataid+'_datafile'
    with open(SaveFileName, mode='w') as f:
        f.write(result + "\n")

    #MAX_ZINDEXの保存
    SaveFileName2 = './'+dataid+'_MAX_ZINDEX'
    with open(SaveFileName2, mode='w') as f:
        f.write(max_zindex + "\n")

    return make_response(result)

# 8401番ポートでWebサーバを起動する
if __name__ == '__main__':
    api.run(host=HOST, port=PORT, debug=True)