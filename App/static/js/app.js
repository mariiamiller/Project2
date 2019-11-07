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
sampleMetadata.selectAll("p").remove();


    // // Use `Object.entries` to add each key and value pair to the panel
    for (key in data) {
      line = data[key];
    d3.select("#sample-metadata").append("p").text(line);
  
    }
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
    
    
        // // Use `Object.entries` to add each key and value pair to the panel
        for (key in data) {
          line = data[key];
        d3.select("#earnings-date").append("p").text(line);
      
        }

      });
    }
    // var dataChart = [
    //   {
    //     domain: { x: [0, 1], y: [0, 1] },
    //     value: data.WFREQ,
    //     title: { text: "Washing Frequency - Scrubs per Week.", font: { size: 14 } },
    //     type: "indicator",
    //     mode: "gauge+number+delta",
    //     gauge: {
    //       axis: { range: [null, 9] },
    //       steps: [
    //         { range: [0, 3], color: "lightgray" },
    //         { range: [3, 6], color: "darkgray" },
    //         { range: [6, 9], color: "gray" }
    //       ]
    //     }
    //   }
    // ];
    
    // var layout = { width: 350, height: 450, margin: { t: 0, b: 0 } };
    // Plotly.newPlot('gauge', dataChart, layout);
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
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  // buildCharts(newSample);
  buildMetadata(newSample);
  buildEarningsDate(newSample);
}

// Initialize the dashboard
init();
