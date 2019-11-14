// @TODO: YOUR CODE HERE!
function buildChart(symbol) {
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


    d3.json(url2).then(function(data2) {
 console.log(data2[1]);
     var dates = [];
    var  surprises = [];

      for (i=0;i< data2.length ;i+=3) {
        dates.push(data2[i+1]);
      }
      console.log(dates);
      for (i=0;i< data2.length ;i+=3) {
        surprises.push(data2[i+2]);
      }
      chartGroup.selectAll("rect")
      .data(surprises)
      .enter()
      .append("rect")
      .attr("width", 50)
      .attr("height", function(data) {
        return data * 10;
      })
      .attr("x", function(data, index) {
        return index * 60;
      })
      .attr("y", function(data) {
        return 600 - data * 10;
      })
      .attr("class", "bar");
    });

}
