// @TODO: YOUR CODE HERE!
function buildChart(symbol) {
d3.select("#bubble").selectAll("svg").remove();
var svgWidth = 960;
var svgHeight = 540;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
url1 = "/dailyprice/"+symbol;
url2 = "/symbols/"+symbol;
d3.json(url2).then(function(data2) {
  d3.json(url1).then(function(data1) {
    var dataset = [];

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#bubble")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
console.log('before graph');
// Append an SVG group
var g = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);



  var x = d3.scaleTime().range([0, width]),
  y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom(x),
  yAxis = d3.axisLeft(y);

  var yScale2 = d3.scaleLinear()

  .range([0, height/2]);
  var yAxisScale2 = d3.scaleLinear()


  var yAxisRight = d3.axisRight(yAxisScale2);
  var zoom = d3.zoom()
  .scaleExtent([1, 32])
  .translateExtent([[0, 0], [width, height]])
  .extent([[0, 0], [width, height]])
  .on("zoom", zoomed);

var area = d3.area()
  .curve(d3.curveMonotoneX)
  .x(function(d) { return x(d[0]); })
  .y0(height)
  .y1(function(d) { return y(d[1]); });

var line = d3.line()
.x(function(d) { return x(d[0]) })
.y(function(d) { return y(d[1]) });

svg.append("defs").append("clipPath")
  .attr("id", "clip")
.append("rect")
  .attr("width", width)
  .attr("height", height);





var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
          if (data2[j+1] == data1[i]){
            // && data2[j+2]>=0){
            loopArray[2] = data2[j+2];
            console.log('equals...')
            }
        }
          dataset.push(loopArray);

        }
 


//console.log(dataset);
var parseTime = d3.timeParse("%Y-%m-%d");
dataset.forEach(function(data) {
  data[0] = parseTime(data[0]);
  console.log(data);
  data[1] = +data[1];
  data[2] = +data[2];
});


    x.domain(d3.extent(dataset, function(d) { return d[0]; }));
    y.domain([0, d3.max(dataset, function(d) { return d[1]; })]);
  yScale2.domain([0, d3.max(dataset, (function (d) {
    return d[2];
  }))]);
  yAxisScale2.domain([ d3.min(dataset, (function (d) {
    return d[2];
  })),  d3.max(dataset, (function (d) {
    return d[2];
  }))])
  .range([height - yScale2(d3.min(dataset, (function (d) {
    return d[2];
  }))), height/2 ]);


    g.append("path")
        .datum(dataset)
        .attr("class", "area")
        .attr("d", area);

       g.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 2)
        .attr("d", line);

        g.selectAll("rect")
        .data(dataset)
        .enter()
        .append('g')
        .append("rect")
        .attr("class", function(d) { return "bar bar--" + (d[2]< 0 ? "negative" : "positive"); })
        .attr("x", d => x(d[0]))
        .attr("y", d => height - Math.max(0,yScale2(d[2])))
        .attr("width", 5)
        // .attr("height", d => height - yScale2(d[2]))
        .attr("height", d => Math.abs(yScale2(d[2])))

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
  
    g.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);
        g.append("g")
        .attr("transform", `translate(${width}, 0)`)
        .call(yAxisRight);
        

  var d0 = new Date(2016, 0, 1),
      d1 = new Date(2019, 0, 1);

  // Gratuitous intro zoom!
  svg.call(zoom).transition()
      .duration(1500)
      .call(zoom.transform, d3.zoomIdentity
          .scale(width / (x(d1) - x(d0)))
          .translate(-x(d0), 0));
 
    

          function zoomed() {
            var t = d3.event.transform, xt = t.rescaleX(x);
            g.select(".area").attr("d", area.x(function(d) { return xt(d[0]); }));
            g.select(".line").attr("d", line.x(function(d) { return xt(d[0]); }));
            g.selectAll(".bar--positive").attr("x", d => xt(d[0]));
            g.selectAll(".bar--negative").attr("x", d => xt(d[0]));
            //.attr("width", x.bandwidth());
            g.select(".axis--x").call(xAxis.scale(xt));
          }


});
  });

  function type(d) {
    d.date = parseDate(d.date);
    d.price = +d.price;
    return d;
  }   
}
