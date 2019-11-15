// @TODO: YOUR CODE HERE!
function buildChart(symbol) {
d3.select("#bubble").selectAll("svg").remove();
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;



// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#bubble")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
console.log('before graph');
// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  url1 = "/dailyprice/"+symbol;
  url2 = "/symbols/"+symbol;
//   var dataset;
// var stockDates = [];
// var parseStockDates = []
// var formatStockDates = []
// var stockPrices = [];
// var stockStringPrices = [];
// d3.json(url1).then(function(data1) {
//   dataset = data1;
//   // console.log(data1);
//   for (i=0;i< data1.length ;i+=2) {

//     stockDates.push(data1[i]);
//     parseStockDates.push(Date.parse(data1[i]));
//     formatStockDates.push(Date(data1[i]));
//     // dates.push(Date(data2[i+1]));
//   }
  
//   for (i=0;i< data1.length ;i+=2) {

//     stockStringPrices.push(data1[i+1]);
//     stockPrices.push(parseFloat(data1[i+1]));
//   }
//   console.log(stockPrices[1]);
// });
// console.log(dataset);
// console.log(stockPrices[1]);
// console.log(stockDates[1]);
// var data2Array = [];
// var dataset;
// d3.json(url2).then(function(data2) {
//   dataset = data2
//   for (i=0; i<dataset.length; i+=3){
//     var dateString = dataset[i+1];

//     var dateParts = dateString.split("/");
//     console.log(dateParts[0]);
//     if (dateParts[0] <10){
//       dateParts[0]="0"+dateParts[0]
//     }
//     if (dateParts[1]<10){
//       dateParts[1]="0"+dateParts[1]
//     }

// // month is 0-based, that's why we need dataParts[1] - 1
//   dataset[i+1] = "20"+dateParts[2]+"-"+dateParts[0]+"-"+dateParts[1];
//   console.log( dataset[i+1]);
//   data2Array.push(dataset[i+1]);
//   data2Array.push(dataset[i+2]);
//   }
// });
// console.log(data2Array);
// }

    d3.json(url2).then(function(data2) {
      d3.json(url1).then(function(data1) {
        var dataset = [];


        for (i=0; i<data2.length; i+=3){
          var dateString = data2[i+1];

          var dateParts = dateString.split("/");
          console.log(dateParts[0]);
          if (dateParts[0] <10){
            dateParts[0]="0"+dateParts[0]
          }
          if (dateParts[1]<10){
            dateParts[1]="0"+dateParts[1]
          }
    
    // month is 0-based, that's why we need dataParts[1] - 1
        data2[i+1] = "20"+dateParts[2]+"-"+dateParts[0]+"-"+dateParts[1];
        console.log( data2[i+1]);
        }
        console.log(data2[1]);

        for (i=0;i< 2000 ;i+=2) {
          // while (data1[i]>=data2[1])
          console.log('inside loop')
          var loopArray = [];
          loopArray.push(data1[i]);
          loopArray.push(parseFloat(data1[i+1]));
          var earnings = 0;
          loopArray.push(earnings);
        for (j=0;j< data2.length ;j+=3){
          if (data2[j+1] == data1[i] && data2[j+2]>=0){
            loopArray[2] = data2[j+2];
            console.log('equals...')
            }
        }
          dataset.push(loopArray);

        }
 


console.log(dataset);
var parseTime = d3.timeParse("%Y-%m-%d");
dataset.forEach(function(data) {
  data[0] = parseTime(data[0]);
  console.log(data);
  data[1] = +data[1];
  data[2] = +data[2];
});

var xScale = d3.scaleTime()
.domain(d3.extent(dataset, d => d[0]))
//.domain(d3.range(dataset.length))
.range([0, width]);
      

      // var xScale = d3.scaleLinear()
      // .rangeRound([0, width])
      // // .padding(0.1)
      // .domain(dataset.map(function(d) {
      //   return d[0];
      // }));
// var yScale = d3.scaleLinear()
//       .rangeRound([height, 0])
//       .domain([0, d3.max(dataset, (function (d) {
//         return d[1];
//       }))]);



      var yScale1 = d3.scaleLinear()
      .domain([0, d3.max(dataset, (function (d) {
        return d[1];
      }))])
      .range([height, 0]);
      var yScale2 = d3.scaleLinear()
      .domain([0, d3.max(dataset, (function (d) {
        return d[2];
      }))])
      .range([height, 0]);

    var yAxisLeft = d3.axisLeft(yScale1);
var yAxisRight = d3.axisRight(yScale2);
  var xAxis = d3.axisBottom(xScale);

  chartGroup.append("g")
//  .attr("class", "axis axis--x")
  .attr("transform", `translate(0, ${height})`)
  .call(xAxis);
  chartGroup.append("g")
  // Define the color of the axis text
  .classed("green", true)
  .call(yAxisLeft);

// Add y2-axis to the right side of the display
chartGroup.append("g")
  // Define the color of the axis text
  .classed("blue", true)
  .attr("transform", `translate(${width}, 0)`)
  .call(yAxisRight);

  // // axis-x
  // chartGroup.append("g")
  // .attr("class", "axis axis--x")
  // .attr("transform", "translate(0," + height + ")")
  // .call(d3.axisBottom(xScale));

// // axis-y
// chartGroup.append("g")
//   .attr("class", "axis axis--y")
//   .call(d3.axisLeft(yScale));

var bar = chartGroup.selectAll("rect")
.data(dataset)
.enter()
.append('g')
.append("rect")
.attr("x", d => xScale(d[0]))
.attr("y", d => yScale2(d[2]))
.attr("width", 5)
.attr("height", d => height - yScale2(d[2]))
.attr("fill", "green")
// event listener for onclick event
.on("click", function(d, i) {
  alert(`Hey! You clicked bar ${dataset[i]}!`);
})
// event listener for mouseover
.on("mouseover", function() {
  d3.select(this)
        .attr("fill", "red");
})
// event listener for mouseout
.on("mouseout", function() {
  d3.select(this)
        .attr("fill", "green");
});


  // var bar = chartGroup.selectAll("rect")
  //   .data(dataset)
  //   .enter().append("g");

  //  // bar chart
  //  bar.append("rect")
  //  .attr("x", (d, i) => xScale(d[i]))
  //  .attr("y", function(d) { return yScale2(d[2]); })
  //  .attr("width", xScale.bandwidth())
  //  .attr("height", function(d) { return height - yScale(d[2]); })
  //  .attr("class", function(d) {
  //    var s = "bar ";
  //    if (d[1] < 80) {
  //      return s + "bar1";
  //    } else if (d[1] < 400) {
  //      return s + "bar2";
  //    } else {
  //      return s + "bar3";
  //    }
  //  });   

   //TO DO LABELS!!!!!

  // line chart
  var line = d3.line()
      .x(d => xScale(d[0]))
      .y(d => yScale1(d[1]));
      // .curve(d3.curveMonotoneX);

  chartGroup.append("path")
  .data([dataset])
    .attr("d", line) // Assign a class for styling
    .classed("line green", true); // 11. Calls the line generator

 bar.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .text(data => data[1])
      .attr("x", d => xScale(d[0]))
      .attr("y", d => yScale1(d[1])+2);

  // bar.append("circle") // Uses the enter().append() method
  //     .attr("class", "dot") // Assign a class for styling
  //     .attr("x", function(d, i) { return xScale(d[0]) -400; })
  //     .attr("y", function(d) { return yScale1(d[1]); })
  //     .attr("r", 5);

 
    });
  });
    }
// //       var yScale2 = d3.scaleLinear()
// //       .domain([0, d3.max(surprises)])
// //       .range([height, 0]);
// //       var yScale1 = d3.scaleLinear()
// //       .domain([0, d3.max(stockPrices)])
// //       .range([height, 0]);
      


// //   // scale x to chart width
// // var xScale = d3.scaleBand()
// //       .domain(parseStockDates)
// //       .range([0, width])
// //       .padding(0.1);

// //       // var xTimeScale = d3.scaleTime()
// //       // .domain(d3.extent(dates))
// //       // .range([0, width]);
      
// //       // var yLinearScale1 = d3.scaleLinear()
// //       // .domain([0, d3.max(surprises)])
// //       // .range([height, 0]);
      

// //       // var yLinearScale2 = d3.scaleLinear()
// //       // .domain([0, d3.max(smurfData, d => d.smurf_sightings)])
// //       // .range([height, 0]);
// //       //  console.log(data2[1]); 
      
// //   //     var bottomAxis = d3.axisBottom(xTimeScale)
// //   //   .tickFormat(d3.timeFormat("%b/%d/%y"));
// //   // var leftAxis = d3.axisLeft(yLinearScale1);

// //   var yAxisLeft = d3.axisLeft(yScale1);
// // var yAxisRight = d3.axisLeft(yScale2);
// //   var xAxis = d3.axisBottom(xScale);

// //   chartGroup.append("g")
// //   .attr("transform", `translate(0, ${height})`)
// //   .call(xAxis);

// Add y1-axis to the left side of the display
// chartGroup.append("g")
//   // Define the color of the axis text
//   .classed("green", true)
//   .call(yAxisLeft);

// // Add y2-axis to the right side of the display
// chartGroup.append("g")
//   // Define the color of the axis text
//   .classed("blue", true)
//   .attr("transform", `translate(${width}, 0)`)
//   .call(yAxisRight);
 
 
 
// // //   chartGroup.append("g")
// // //   .attr("transform", `translate(0, ${height})`)
// // //   .call(xAxis);

// // // // Add y1-axis to the left side of the display
// // // chartGroup.append("g")
// // //   // Define the color of the axis text
// // //   .classed("green", true)
// // //   .call(yAxisLeft);
// // //   chartGroup.append("g")
// // //   // Define the color of the axis text
// // //   .classed("blue", true)
// // //   .call(yAxisRight);

// //   var line1 = d3.line()
// //   .x(d => xScale(parseStockDates))
// //   .y(d => yScale1(stockPrices));

// //   chartGroup.append("path")
// //     .data(stockPrices)
// //     .attr("d", line1)
// //     .classed("line green", true);

// //       console.log(surprises);


      // chartGroup.selectAll("rect")
      // .data(surprises)
      // .enter()
      // .append("rect")
      // .attr("x", (d, i) => xScale(parseDates[i]))
      // .attr("y", d => yScale2(d))
      // .attr("width", xScale.bandwidth())
      // .attr("height", d => height - yScale2(d))
      // .attr("fill", "green")
      // // event listener for onclick event
      // .on("click", function(d, i) {
      //   alert(`Hey! You clicked bar ${dates[i]}!`);
      // })
      // // event listener for mouseover
      // .on("mouseover", function() {
      //   d3.select(this)
      //         .attr("fill", "red");
      // })
      // // event listener for mouseout
      // .on("mouseout", function() {
      //   d3.select(this)
      //         .attr("fill", "green");
      // });
//     });
//   });
//     }




//       chartGroup.selectAll("rect")
//       .data(surprises)
//       .enter()
//       .append("rect")
//       .attr("width", 15)
//       .attr("height", function(data) {
//         return data * 5000;
//       })
//       .attr("x", function(data, index) {
//         return index * 25;
//       })
//       .attr("y", function(data) {
//         return 600 - data * 5000;
//       })
//       .attr("class", "bar")


//     });

// }
