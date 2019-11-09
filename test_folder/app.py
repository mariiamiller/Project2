import os

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

import pandas as pd
import numpy as np
import requests
import time
import csv
import json

app = Flask(__name__)


# create route that renders index.html template
@app.route("/")
def index():
    api_key =  "V9FZCMP0HRSJA6B"
    base_url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=AMZN&interval=5min&apikey="+api_key

    symbol = "BA"
    price_time = "TIME_SERIES_INTRADAY"
    interval = "5min"
    url =  f"{base_url}function={price_time}&symbol={symbol}&interval={interval}&apikey={api_key}"
    response = requests.get(url).json()

    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)
