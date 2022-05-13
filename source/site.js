(function (d3) { 
  'use strict';
  const margin = {top: 10, right: 10, bottom: 10, left: 10},
  w = 1000 - margin.left - margin.right,
  h = 1000 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg4 = d3.select("#my_dataviz4")
.append("svg")
  .attr("width", w + margin.left + margin.right)
  .attr("height", h + margin.top + margin.bottom)
.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

  const path = d3.geoPath();
const projection = d3.geoMercator()
.scale(100)
.center([10,30])
.translate([w / 3, h / 3]);

const data = new Map();
const colorScale = d3.scaleThreshold()
.domain([1,9, 20, 49, 100, 151,384,725,1820])
.range(d3.schemeBlues[9]);



let value=function(d) {return {freq:d.freq, list_in:{name:d.list_in,amount:d.amount}}}
// Load external data and boot
Promise.all([
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
d3.csv("https://raw.githubusercontent.com/casihoicho/DSDV-repo/Duy/freq.csv", function(d) {

data.set(d.code, d.freq)

})

]).then(function(loadData){
  let topo = loadData[0]
  console.log(topo);
  let mouseOver = function() {
  d3.select(this)
    .style("stroke", "black")
    .append("title")
    .text(function(d) {
      return d.properties.name + ", " +d.total})

};

let mouseLeave = function(d) {
  d3.select(this)
    .transition()
    .duration(200)
    .style("stroke", "none")
}

// Draw the map
svg4.append("g")
  .selectAll("path")
  .data(topo.features)
  .enter()
  .append("path")
    // draw each country
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    // set the color of each country
    .attr("fill", function (d) {
      d.total = data.get(d.id) || 0;
      return colorScale(d.total);
    })
    .style("stroke", "transparent")
    .attr("class", function(d){ return "Country" } )
    .style("opacity", .8)
    .on("mouseover", mouseOver )
    .on("mouseleave", mouseLeave )
    

  })

}(d3))