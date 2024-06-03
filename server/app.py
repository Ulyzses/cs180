from flask import Flask, request, jsonify

import cleantext
import demoji
import html2text as h2t
import joblib
import re


def removeExtraCharacters(s):
    # Uses cleantext library to remove extra characters, lowecase all text, and remove stopwords
    return cleantext.clean(s, lowercase=True, punct=True, extra_spaces=True, stopwords=True, stp_lang='english')

def cleanString(s):
    # Uses demoji library to remove any emojis in the email.
    return demoji.replace(removeExtraCharacters(s), '')

def removeReplies(s):
    # Removes any replies in the email.
    return re.sub(r'<[^<]*class=\"gmail_quote\"[\s\S]*$', '', s)


app = Flask(__name__) 


@app.route("/ping")
def test():
    return "Pong!"


@app.route('/predict', methods=['POST']) 
def running():
    # receive the data
    req = request.get_json(force=True)  
    email = req['email']

    # clean the email
    text = h2t.html2text(email)
    text = removeReplies(text)
    text = cleanString(text)

    # load the model and vectorizer
    vectorizer = joblib.load('tfidf.pkl')
    model = joblib.load('svmsvc_model.pkl')

    # predict the email
    vectorized_text = vectorizer.transform([text])
    prediction = model.predict(vectorized_text)

    # create the response as a dict
    response = {
        'prediction': prediction.tolist()[0]
    } 

    # put the response in json and return
    return jsonify(response) 