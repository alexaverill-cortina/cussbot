import json
import pymysql.cursors
from flask import Flask
from flask import request
from flask_cors import CORS
from numpy.core.numeric import full
from tensorflow import keras
from keras_preprocessing.text import tokenizer_from_json
from tensorflow.keras.preprocessing.sequence import pad_sequences

application  = Flask(__name__)
cors = CORS(application)  

entries = []

model = keras.models.load_model('profanity_model')
max_length = 50
threshold = 0.6

with open('tokenizer.json') as f:
    data = json.load(f)
    tokenizer = tokenizer_from_json(data)

#, resources={r"/api/*": {"origins": "*"}}
def getProbability(predictions, index, value):

    result = {"probability": 0, "isProfane":False, "value": value}
    probability = float(predictions[index][0])

    print(probability)

    if probability >= threshold:
        result["isProfane"] = True
        result["probability"] = probability
    else:
        result["probability"] = 1 - probability
    return result


@application .route("/")
def home():
    return "Model 1.02"

@application .route('/api/predict', methods=['POST'])
def predict():
 
    json = {"error" : "", "isProfane":False, "confidence":0, "first" : { "isProfane": False, "probability": 0, "value":""}, "last" : { "isProfane": False, "probability": 0, "value":""}, "full" : { "isProfane": False, "probability": 0, "value":""}}

    firstname = ""
    lastname = ""
    fullname = ""
    profane = []
    notProfane = []
    results = {}

    if request.method == 'POST':

        if "firstname" in request.form:
            firstname = request.form['firstname'].replace(' ', '')
            fullname = firstname
            
        else:
            json["error"] = "firstname is undefined"
            return json

        if "lastname" in request.form:
            lastname = request.form['lastname'].replace(' ', '')
            fullname += lastname

    fullname = fullname.lower()

    text = [firstname, lastname, fullname]
    sequence = tokenizer.texts_to_sequences(text)
    padded = pad_sequences(sequence, maxlen=max_length)
    predictions = model.predict(padded)

    results["first"] = getProbability(predictions, 0, firstname)
    results["last"] = getProbability(predictions, 1, lastname)
    results["full"] = getProbability(predictions, 2, fullname)

    for x in results:
        if results[x]["isProfane"]:
            profane.append(results[x]["probability"])
        else:
            notProfane.append(results[x]["probability"])

    json["first"] = results["first"]
    json["last"] = results["last"]
    json["full"] = results["full"]

    json["isProfane"] = len(profane) > 0

    if(json["isProfane"]):
        json["confidence"] = max(profane)
    else:
        json["confidence"] = min(notProfane)

    return json


# run the app.
if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    # application .debug = True
    # application.host = '0.0.0.0'
    application.run(host='0.0.0.0')