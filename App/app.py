import os

import pandas as pd
import numpy as np
import requests
import time
import csv
import json

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
symbols = Base.classes.symbols
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

    results = session.query(symbols.Symbol).order_by(symbols.Symbol).all()

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

    results = session.query(symbols.Symbol, symbols.Name, symbols.SummaryQuote).\
    filter(symbols.Symbol == symbol).all()

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
    prices = {}
    for date in dates:
        prices[date] = response['Time Series (Daily)'][date]['5. adjusted close']


    return jsonify(prices)



if __name__ == "__main__":
    app.run()