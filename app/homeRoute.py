from flask import render_template, request, jsonify, make_response
from app import app

@app.route('/')
@app.route('/index')
def index():
    theMessage = ""
    return render_template('index.html', splashMessage=theMessage)

