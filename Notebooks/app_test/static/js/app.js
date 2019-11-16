console.log('client js')

console.log("Mariaaa mariaaaaaa");


$(document).ready(function() {
  $('#selDataset').select2();
});

function buildMetadata(symbol) {

  // @TODO: Complete the following function that builds the metadata panel
  var url = "/names/"+symbol;
  //Use `d3.json` to fetch the metadata for a sample
  
  var data = []
 // d3.json(url, function (json) {
   d3.json(url).then(function(data) { 

  console.log(data);
  


    // Use d3 to select the panel with id of `#sample-metadata`
var sampleMetadata = d3.select("#sample-metadata")
// Use `.html("") to clear any existing metadata
sampleMetadata.selectAll("h2").remove();
sampleMetadata.selectAll("p").remove();
sampleMetadata.selectAll("a").remove();


d3.select("#sample-metadata").append("h2").text(data[0]);
d3.select("#sample-metadata").append("p").text(data[1]);
d3.select("#sample-metadata").append("p").text(data[2]);
d3.select("#sample-metadata").append("p").text(data[3]);
d3.select("#sample-metadata").append("a").text("more info").attr("href",data[4]);

    // // // Use `Object.entries` to add each key and value pair to the panel
    // for (key in data) {
    //   line = data[key];
    // d3.select("#sample-metadata").append("p").text(line);
  
    // }
  });
}



function buildEarningsDate(symbol) {

  var url = "/q3earnings/"+symbol;
  //Use `d3.json` to fetch the metadata for a sample
  
  var data = []
 // d3.json(url, function (json) {
   d3.json(url).then(function(data) { 

  console.log(data);
    var earningsDate = d3.select("#earnings-date")
    // Use `.html("") to clear any existing metadata
    earningsDate.selectAll("p").remove();
    var CurrentDate = new Date();
    var givenDate = new Date(data[1]);

    console.log(givenDate);
    console.log(CurrentDate);
    if (givenDate > CurrentDate) {
      console.log("upcoming")
    }
    if (givenDate > CurrentDate) {
        if (data[2]== 'pre' || data[2]== 'post') {
    d3.select("#earnings-date").append("p").text("Upcoming release: "+data[1]+", "+data[2]+"-market");
    }
    else {
      d3.select("#earnings-date").append("p").text("Upcoming release: "+data[1])
    }
    }
        // // // Use `Object.entries` to add each key and value pair to the panel
        // for (key in data) {
        //   line = data[key];
        // d3.select("#earnings-date").append("p").text(line);
      
        // }

      });
   }
   function buildEarningsRelease(symbol) {

    var url = "/latest_report/"+symbol;
    //Use `d3.json` to fetch the metadata for a sample
    
    var data = []
   // d3.json(url, function (json) {
     d3.json(url).then(function(data) { 
  
    console.log(data);
      var earningsDate = d3.select("#earnings-release")
      // Use `.html("") to clear any existing metadata
      earningsDate.selectAll("p").remove();
      earningsDate.selectAll("a").remove();

      d3.select("#earnings-release").append("p").text(data[0]+" released on "+data[1]);
      

        d3.select("#earnings-release").append("a").text("full report").attr("href",data[2]);
    
      
          // // // Use `Object.entries` to add each key and value pair to the panel
          // for (key in data) {
          //   line = data[key];
          // d3.select("#earnings-date").append("p").text(line);
        
          // }
  
        });
     }



   function buildSurprise(symbol) {
    var url = "/surprise/"+symbol;
    
    d3.json(url).then(function(data) {
    console.log(symbol);
    console.log(data[2]);
    
    var dataChart = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: data[1],
        title: { text: "Prediction Inaccuracy", font: { size: 14 } },
        type: "indicator",
        mode: "gauge+number+delta",
        gauge: {
          axis: { range: [null, .5] },
          steps: [
            { range: [0, .02589], color: "greenyellow" },
            { range: [.02589, .125443], color: "yellow" },
            { range: [.125443, .5], color: "red" }
          ],

        }
      }
    ];
    
    var layout = { width: 280, height: 180, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', dataChart, layout);

    var dataChart2 = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: data[2],
        title: { text: "Beat Score", font: { size: 14 } },
        type: "indicator",
        mode: "gauge+number+delta",
        gauge: {
          axis: { range: [null, 1] },
          bar: { color: "darkgreen" },
          steps: [
            { range: [0, .5], color: "red" },
            { range: [.5, .821429], color: "yellow" },
            { range: [.821429, 1], color: "greenyellow" }
          ],

        }
      }
    ];

    var layout = { width: 280, height: 180, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge2', dataChart2, layout);

  });
}
    // // Hint: Inside the loop, you will need to use d3 to append new
    // // tags for each key-value in the metadata.


// function buildCharts(symbol) {

//   // @TODO: Use `d3.json` to fetch the sample data for the plots
//   var url = "/symbols/"+symbol;


 
//     d3.json(url).then(function(symbol) {
//       console.log(symbol);

//       console.log(symbol.symbol)
//     //       // Grab values from the response json object to build the plots
//     // var sample_values = sample.sample_values.slice(0,10);
//     // var otu_ids = sample.otu_ids.slice(0,10);
//     // var otu_labels = sample.otu_labels.slice(0,10);

//     // var data = [{
//     //   values: sample_values,
//     //   labels: otu_ids,
//     //   hovertext: otu_labels,
//     //   type: "pie"
//     // }];
  
//     // var layout = {
//     //   height: 450,
//     //   width: 400
//     // };
  
//     // Plotly.plot("pie", data, layout);

//     // var data1 = [{
//     //   x: otu_ids,
//     //   y: sample_values,
//     //   hovertext: otu_labels,
//     //   mode: 'markers',
//     //   marker: {
//     //     color: otu_ids,
//     //     size: sample_values
//     //   }
//     // }];
    
    
//     // var layout1 = {

//     //   showlegend: true,
//     //   height: 600,
//     //   width: 1000
//     // };
    
//     // Plotly.newPlot('bubble', data1, layout1);
//     });
//     // @TODO: Build a Bubble Chart using the sample data

//     // @TODO: Build a Pie Chart
//     // HINT: You will need to use slice() to grab the top 10 sample_values,
//     // otu_ids, and labels (10 each).
// }

function buildIntradayPrice(symbol) {
  var apiKey = "OSXA529CXOB3M9RL";

  // var theURL = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${apiKey}`;
  // var theURL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
  var theURL = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`


  $(document).ready(function() {
    $("#stockIndicator").show();
    doAjax(theURL);

    $('.ajaxtrigger').click(function() {
      $("#stockIndicator").show();
      doAjax(theURL);
      return false;
    });

    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
    }

    function doAjax(url) {
      $.ajax({
        url: url,
        dataType: 'json',
        contentType: "application/json",
        success: function(data) {

          var stockSymbol = data['Meta Data']['2. Symbol']
          var lastRefreshed = data['Meta Data']['3. Last Refreshed']
          var lastTradePriceOnly = data['Time Series (5min)'][lastRefreshed]['4. close']
          var lastVolume = data['Time Series (5min)'][lastRefreshed]['5. volume']
          
          var rawSeries = data['Time Series (5min)']
          var series = Object.keys(rawSeries).map(timestamp => {
            return {timestamp, value: rawSeries[timestamp]['4. close']}
          });

          var previousTradePrice = series[1].value

          var change = lastTradePriceOnly - previousTradePrice
          var percentageChange = change/previousTradePrice*100


          console.log(parseFloat(percentageChange).toFixed(2)+"%")
          console.log(lastRefreshed);

          $('#stockSymbol').html(stockSymbol);
          $('#stockAsk').html(lastTradePriceOnly);
          $('#stockLastRefreshed').html(lastRefreshed);
          $('#stockVolume').html(numberWithCommas(lastVolume));
          $('#stockChange').html(parseFloat(change).toFixed(2));
          $("#stockChangePercent").html(parseFloat(percentageChange).toFixed(2)+"%");
          $("#stockIndicator").hide();
        }
      });
    }
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/namelist").then((symbolNames) => {
    symbolNames.forEach((symbol) => {
      selector
        .append("option")
        .text(symbol)
        .property("value", symbol);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = symbolNames[0];
    // buildCharts(firstSample);
    buildMetadata(firstSample);
    buildEarningsDate(firstSample);
    buildSurprise(firstSample);
    buildEarningsRelease(firstSample);
    // TODO
    buildChart(firstSample);
    buildIntradayPrice(firstSample);
    buildChart2(newSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  // buildCharts(newSample);
  buildMetadata(newSample);
  buildEarningsDate(newSample);
  buildSurprise(newSample);
  buildEarningsRelease(newSample);
  buildChart(newSample);
  buildIntradayPrice(newSample);
  buildChart2(newSample);
}


// Initialize the dashboard
init();
