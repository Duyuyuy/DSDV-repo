(function (d3) { 
  'use strict';
  const margin = {top: 30, right: 30, bottom: 60, left: 200},
  width = 800 - margin.left - margin.right,
  height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg4 = d3.select("#my_dataviz1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// get the data
Promise.all([
d3.csv("https://raw.githubusercontent.com/casihoicho/DSDV-repo/Duy/data/duration.csv"),
d3.csv("https://raw.githubusercontent.com/casihoicho/DSDV-repo/Duy/data/season_count.csv")])
.then( function(data) {

  let x = d3.scaleLinear()
          .domain([0, 200])
          .range([0, width]);
  let xaxis=svg4.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

    const histogram = d3.histogram()
    .value(function(d) { return d.duration; })   
    .domain(x.domain())  
    .thresholds(x.ticks(70)); 

  let bins = histogram(data[0])

  let y = d3.scaleLinear()
          .range([height, 0])
          .domain([0, d3.max(bins, function(d) { return d.length; })]);
  let yaxis=svg4.append("g")
    .call(d3.axisLeft(y));

  const kde = kernelDensityEstimator(kernelEpanechnikov(22), x.ticks(100))
  const density =  kde( data[0].map(function(d){  return d.duration; }) )

  svg4.selectAll("rect")
      .data(bins)
      .join("rect")
      .attr("x", 1)
  .attr("transform", function(d) { return `translate(${x(d.x0)} , ${y(d.length)})`})
      .attr("width", function(d) { return x(d.x1) - x(d.x0) })
      .attr("height", function(d) { return height - y(d.length); })
      .style("fill", "#D62A28")
let curve= svg4.append("path")
    .attr("class", "mypath")
    .datum(density)
    .attr("fill", "none")
    .attr("opacity", ".8")
    .attr("stroke", "#000")
    .attr("stroke-width", 1)
    .attr("stroke-linejoin", "round")
    .attr("d",  d3.line()
      .curve(d3.curveBasis)
        .x(function(d) { return x(d[0]); })
        .y(function(d) { return y(d[1]*10000); })
    )
    .attr("stroke-width", 3);

    let label=svg4.append("text")      // text label for the x axis
        .attr("x", width / 2 )
        .attr("y", height+40 )
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .text("minutes");


var allGroup = ['movie','TV_show'];

var dropdownButton = d3.select("#my_dataviz1")
.append('select')



    dropdownButton 
.selectAll('myOptions') 
.data(allGroup) 
.enter()
.append('option')
.text(function (d) { return d; }) // text showed in the menu
.attr("value", function (d) { return d; })

dropdownButton.on("change", function(d) {

  var selectedOption = d3.select(this).property("value")
  if (selectedOption === 'movie')  updateChart(data[0],200,10000,22,'#D62A28',"#262626","minutes")
    else updateChart(data[1],16,5000,4,"#262626","#D62A28","seasons");
 
})

function updateChart(data,X,n,k,color,color2,m) {
   x = d3.scaleLinear()
          .domain([0, X])
          .range([0, width]);
          xaxis.transition().duration(1000)
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    ;
    bins = histogram(data)  

 y = d3.scaleLinear()
          .range([height, 0])
          .domain([0,  d3.max(bins, function(d) { return d.length; })]);
          yaxis.transition().duration(1000)
    .call(d3.axisLeft(y))
    ;
       
    svg4.selectAll("rect")
    .data(bins)
    .join("rect")
    .attr("x", 1)
    .attr("transform", function(d) { return `translate(${x(d.x0)} , ${y(d.length)})`})
        .attr("width", function(d) { return x(d.x1) - x(d.x0) })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", color)
const kde = kernelDensityEstimator(kernelEpanechnikov(k), x.ticks(80))
const density =  kde( data.map(function(d){  return d.duration; }) )

curve
.datum(density)
.transition()
.duration(1000)
.attr("d",  d3.line()
  .curve(d3.curveBasis)
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1]*n); })
)
.attr("stroke",color2)
.attr("stroke-width", 3);

label     // text label for the x axis

.text(m);
}



// Function to compute density
function kernelDensityEstimator(kernel, X) {
return function(V) {
  return X.map(function(x) {
    return [x, d3.mean(V, function(v) { return kernel(x - v); })];
  });
};
}

function kernelEpanechnikov(k) {
return function(v) {
  return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
};
}


// add the options to the button
});
}(d3))