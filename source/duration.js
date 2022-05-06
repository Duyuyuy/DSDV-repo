(function (d3) { 
  'use strict';
  const margin = {top: 30, right: 30, bottom: 30, left: 50},
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("body")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// get the data
Promise.all([
d3.csv("https://raw.githubusercontent.com/casihoicho/DSDV-repo/Duy/duration.csv"),
.then( function(data) {

// add the x Axis
const x = d3.scaleLinear()
          .domain([0, 200])
          .range([0, width]);
svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

// add the y Axis
const y = d3.scaleLinear()
          .range([height, 0])
          .domain([0, 2500]);
svg.append("g")
    .call(d3.axisLeft(y));

// Compute kernel density estimation
const kde = kernelDensityEstimator(kernelEpanechnikov(1), x.ticks(100))
const density =  kde( data.map(function(d){  return d.duration; }) )

// Plot the area
svg.append("path")
    .attr("class", "mypath")
    .datum(density)
    .attr("fill", "#69b3a2")
    .attr("opacity", ".8")
    .attr("stroke", "#000")
    .attr("stroke-width", 1)
    .attr("stroke-linejoin", "round")
    .attr("d",  d3.line()
      .curve(d3.curveBasis)
        .x(function(d) { return x(d[0]); })
        .y(function(d) { return y(d[1]*100000); })
    );

});


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

}(d3))