
// function handleSubmit() {
//     // Prevent the page from refreshing
//     d3.event.preventDefault();
  
//     // Select the input value from the form
//     var stock = d3.select("#selDataset").node().value;
//     console.log(stock);
  
//     // clear the input value
//     d3.select("#selDataset").node().value = "";

//     buildPlot(stock);
  
//   }
d3.select("#visualization").selectAll("svg").remove();
var svg = d3
  .select("#bubble")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
console.log('before graph');
// Append an SVG group
var g = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

function buildChart2(symbol) {
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
          console.log(series);
          
          // function any (series){
          //   var dataArr = []
          //   series.forEach(function(element){
          //     if(isNaN(element)) {
          //       dataArr.push(element);
          //     };
          //     console.log(dataArr)
          //   });
          // };
  

          
          series.forEach((element, index) => {
            console.log(element.value);
            console.log(index);
          });


          console.log(parseFloat(percentageChange).toFixed(2)+"%")


          $('#stockSymbol').html(stockSymbol);
          $('#stockAsk').html(lastTradePriceOnly);
          $('#stockVolume').html(numberWithCommas(lastVolume));
          $('#stockChange').html(parseFloat(change).toFixed(2));
          $("#stockChangePercent").html(parseFloat(percentageChange).toFixed(2)+"%");
          $("#stockIndicator").hide();



          var lineData = 	series.map(function(d) {
                      return {
                        date: new Date(Date.parse(d.timestamp)),
                        value: d.value
                      };
                    });


          var vis = d3.select("#visualisation"),
            WIDTH = 600,
            HEIGHT = 250,
            MARGINS = {
              top: 20,
              right: 20,
              bottom: 20,
              left: 50
            },
          xRange = d3.scaleTime()
          .range([MARGINS.left, WIDTH - MARGINS.right])
          .domain([d3.min(lineData, function (d) {
            return d.date;
          }),
            d3.max(lineData, function (d) {
              return d.date;
            })
          ]),

          yRange = d3.scaleLinear()
          .range([HEIGHT - MARGINS.top, MARGINS.bottom])
          .domain([d3.min(lineData, function (d) {
            return d.value;
          }),
            d3.max(lineData, function (d) {
              return d.value;
            })
          ]),

          xAxis = d3.axisBottom()
            .scale(xRange)
            .tickSize(3),

          yAxis = d3.axisLeft()
            .scale(yRange)
            .tickSize(3);

          vis.append("svg:g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
          .call(xAxis);

          vis.append("svg:g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + (MARGINS.left) + ",0)")
          .call(yAxis);

          var lineFunc = d3.line()
            .x(function (d) {
             return xRange(d.date);
            })
            .y(function (d) {
             return yRange(d.value);
            });

          vis.append("svg:path")
            .attr("d", lineFunc(lineData))
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("fill", "none");

          // var ctx = document.getElementById('myChart').getContext('2d');
          // let myChart = ctx

          // let massPopChart = new Chart(myChart, {
          //   type: 'line',
          //   data: {
          //     datasets: [{
          //     label: symbol,
          //     data: plotData,
            
            
        
          //     }]
          //   },
          //   options: {
          //     scales: {
          //       yAxes: [{
          //         ticks: {
          //             beginAtZero: true
          //         }
          //       }]
          //     }
          //   }
          // });
        }
      });
    }
  });
}
// var ctx = document.getElementById('myChart').getContext('2d');
// let myChart = ctx

// let massPopChart = new Chart(myChart, {
//     type: 'line',
//     data: {
//         datasets: [{
//             label: series[0].value,
//             data: series[1].value,
            
            
        
//         }]
//     },
//     options: {
//         scales: {
//             yAxes: [{
//                 ticks: {
//                     beginAtZero: true
//                 }
//             }]
//         }
//     }
// });

