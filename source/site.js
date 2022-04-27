(function (d3) { 
  'use strict';
  var w = 1000;
  var h = 1000;
  var barPadding = 1;
  var padding = 35;
  var svg = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

  const path = d3.geoPath();
const projection = d3.geoMercator()
.scale(70)
.center([0,20])
.translate([w / 2, h / 2]);

const data = new Map();
const colorScale = d3.scaleThreshold()
.domain([9, 20, 49, 100, 150,383,721,1818])
.range(d3.schemeBlues[9]);


// Load external data and boot
Promise.all([
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
d3.csv("https://raw.githubusercontent.com/casihoicho/DSDV-repo/Duy/new.csv", function(d) {

data.set(d.code, +d.freq)
  
})]).then(function(loadData){
  let topo = loadData[0]
  console.log(topo);
  let mouseOver = function(d) {
  d3.selectAll(".Country")
    .transition()
    .duration(200)
    .style("opacity", .5)
  d3.select(this)
    .transition()
    .duration(200)
    .style("opacity", 1)
    .style("stroke", "black")
}

let mouseLeave = function(d) {
  d3.selectAll(".Country")
    .transition()
    .duration(200)
    .style("opacity", .8)
  d3.select(this)
    .transition()
    .duration(200)
    .style("stroke", "transparent")
}

// Draw the map
svg.append("g")
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