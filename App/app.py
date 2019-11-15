import os

import pandas as pd
import numpy as np
import requests
import time
import csv
import json
from bs4 import BeautifulSoup
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///earnings.sqlite"
# db = SQLAlchemy(app)

# # reflect an existing database into a new model
# Base = automap_base()
# # reflect the tables
# Base.prepare(db.engine, reflect=True)

# # Save references to each table
# #Samples_Metadata = Base.classes.sample_metadata
# Earnings = Base.classes.Earnings

engine = create_engine("sqlite:///db/earnings.sqlite")

Base = automap_base()

Base.prepare(engine, reflect=True)

Earnings = Base.classes.earnings
symbols = Base.classes.symbols_sectors
q3earnings = Base.classes.earnings_dates
surprise_sum = Base.classes.surprise_summary_clean

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/namelist")
def namelist():
    """Return a list of names."""

    # # Use Pandas to perform the sql query
    # stmt = db.session.query(symbol).statement
    # df = pd.read_sql_query(stmt, db.session.bind)

    # # Return a list of the column names (sample names)
    # return jsonify(list(df.columns)[2:])

    session = Session(engine)

    results = session.query(symbols.symbol).order_by(symbols.symbol).all()

    #session.close()
    all_symbols = list(np.ravel(results))

    return jsonify(all_symbols)


@app.route("/names/<symbol>")
def names(symbol):
    """Return a list of names and info."""

    # # Use Pandas to perform the sql query
    # stmt = db.session.query(symbol).statement
    # df = pd.read_sql_query(stmt, db.session.bind)

    # # Return a list of the column names (sample names)
    # return jsonify(list(df.columns)[2:])

    session = Session(engine)

    results = session.query(symbols.symbol, symbols.Name, symbols.sector, symbols.industry, symbols.SummaryQuote).\
    filter(symbols.symbol == symbol).all()

    #session.close()
    all_symbols = list(np.ravel(results))

    return jsonify(all_symbols)



# @app.route("/metadata/<sample>")
# def sample_metadata(sample):
#     """Return the MetaData for a given sample."""
#     sel = [
#         Samples_Metadata.sample,
#         Samples_Metadata.ETHNICITY,
#         Samples_Metadata.GENDER,
#         Samples_Metadata.AGE,
#         Samples_Metadata.LOCATION,
#         Samples_Metadata.BBTYPE,
#         Samples_Metadata.WFREQ,
#     ]

#     results = db.session.query(*sel).filter(Samples_Metadata.sample == sample).all()

#     # Create a dictionary entry for each row of metadata information
#     sample_metadata = {}
#     for result in results:
#         sample_metadata["sample"] = result[0]
#         sample_metadata["ETHNICITY"] = result[1]
#         sample_metadata["GENDER"] = result[2]
#         sample_metadata["AGE"] = result[3]
#         sample_metadata["LOCATION"] = result[4]
#         sample_metadata["BBTYPE"] = result[5]
#         sample_metadata["WFREQ"] = result[6]

#     print(sample_metadata)
#     return jsonify(sample_metadata)


@app.route("/symbols/<symbol>")
def symbols_func(symbol):
    """Return `symbol`, `date`,and `eps and eps_est`."""

    session = Session(engine)
    results = session.query( Earnings.symbol, Earnings.date, Earnings.surp).\
    filter(Earnings.symbol == symbol).all()
    #session.close()
    
    data = list(np.ravel(results))




    return jsonify(data)

@app.route("/q3earnings/<symbol>")
def q3earnings_date(symbol):
    """Return `q3` earnings."""

    session = Session(engine)
    results = session.query( q3earnings.symbol, q3earnings.date, q3earnings.release_time).\
    filter(q3earnings.symbol == symbol).all()
    #session.close()
    
    data = list(np.ravel(results))




    return jsonify(data)
@app.route("/surprise/<symbol>")
def surprise(symbol):
    """Return `q3` surprise data."""

    session = Session(engine)
    results = session.query( surprise_sum.symbol, surprise_sum.surp_score, surprise_sum.beat_score).\
    filter(surprise_sum.symbol == symbol).all()
    #session.close()
    
    data = list(np.ravel(results))

    return jsonify(data)

@app.route("/dailyprice/<symbol>")
def dailyprice(symbol):
    api_key =  "V9FZCMP0HRSJA6B"
    base_url = "https://www.alphavantage.co/query?"

    price_time = "TIME_SERIES_DAILY_ADJUSTED"

    url =  f"{base_url}function={price_time}&symbol={symbol}&outputsize=full&apikey={api_key}"
    response = requests.get(url).json()
    dates = response.get("Time Series (Daily)").keys()
    prices = []
    for date in dates:
        prices.append(date)
        prices.append(response['Time Series (Daily)'][date]['5. adjusted close'])
    return jsonify(prices)

@app.route("/intradayprice/<symbol>")
def intradayprice(symbol):
    api_key =  "V9FZCMP0HRSJA6B"
    base_url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=AMZN&interval=5min&apikey="+api_key

    
    price_time = "TIME_SERIES_INTRADAY"
    interval = "5min"
    url =  f"{base_url}function={price_time}&symbol={symbol}&interval={interval}&apikey={api_key}"
    response = requests.get(url).json()

    as_of = response["Meta Data"]["3. Last Refreshed"]
    price = response["Time Series (5min)"][as_of]["4. close"]


    data = [as_of, price]
    return jsonify(data)

@app.route("/latest_report/<symbol>")
def latest_report(symbol):

    url = 'https://www.sec.gov/cgi-bin/browse-edgar?CIK='+symbol+'&owner=exclude&action=getcompany&Find=Search'
    response = requests.get(url)
    soup = BeautifulSoup(response.text)
    results = soup.find('table', class_="tableFile2")
    trs = results.find_all('tr')
    qtr_t = []
    dates = []
    links = []
    for tr in trs:
        line = tr.find('td')
        if line:
            if line.text == '10-Q'or line.text == '10-K':
                qtr_t.append(line.text)
                dates.append(tr.find_all('td')[3].text)
                links.append('https://www.sec.gov'+tr.find_all('a')[1]['href'])
    

    data = (qtr_t[0],dates[0],links[0])
    return jsonify(data)

if __name__ == "__main__":
    app.run()
