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
  const svg2 = d3.select("#my_dataviz2")
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
.domain([1,9, 23, 63, 125, 228,472,749,1820])
.range(["#D8D9DA","#C9CACB","#B7B9B9","#A5A6A7","#909191","#7E7F7F","#6A6B6B","#595959","#3F3F3F","#262626"]);


const Coscale = d3.scaleThreshold()
.domain([20, 50, 75, 100, 150, 200,400,600,800,1000])
.range(["#FCDCE0","#F8C8CC","#F8C8CC","#EEA4A7","#EA9294","#E68183","#E16B6C","#DD5A5C","#D84648","#D62A28"]);
let dat=[];
let value=function(d) { return {
  listed_in:d['listed_in'],
  name:d['name'],
  code:d.code,
  amount: parseFloat(d['amount']),

}}
// Load external data and boot
Promise.all([
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
d3.csv("https://raw.githubusercontent.com/casihoicho/DSDV-repo/Duy/data/new.csv", function(d) {
dat.push(value(d));
data.set(d.code, d.freq)

})

]).then(function(loadData){
  console.log(loadData.code);
  let topo = loadData[0]
  console.log(topo);
  const Tooltip = d3.select("#my_dataviz4")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
  let mouseOver = function(event, d) {

    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
      .attr("fill", "#D62A28")
};


var mousemove = function(event,d) {
  d3.select(this)
  .append("title")
  .text(function(d) {
    return d.properties.name + ", " +d.total ;
  });}

let mouseLeave = function(event, d) {

  Tooltip
  .transition()
  .duration(200)
  .style("opacity", 0)

  d3.select(this)
    .transition()
    .duration(200)
    .style("stroke", "none")
    .attr("fill", function (d) {
      d.total = data.get(d.id) || 0;
      return colorScale(d.total);
    })
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
    .on("mousemove", mousemove)

    .on("mouseleave", mouseLeave )
    .on('click', function(d){

     var selectedOption, total
      d3.select(this). style("stroke", "black")
      .append("title")
      .text(function(d) { selectedOption = d.id, total = d.total;
        return d.properties.name + ", " +d.total})
      if (total == 0) {
        svg2.selectAll("*").remove()
              var rect = svg2.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", h)
    .attr("width", w)
    .style("fill", 'grey');

        let ticker = svg2.append("text")
        .attr("x", w/2)
        .attr("y", h/2)
        .attr("text-anchor", "middle")
        .style("font-size", "30px")
        .text("No data available for this country");

      }
      else {
      
      let data2=dat.filter(function(d){return d.code==selectedOption})
      var selected= data2.map(function(d){return d.name})
      selected=selected[0]

      data2.unshift({"listed_in":selected,"name":"","amount":0})
      const root = d3.stratify()
      .id(function(d) { return d['listed_in']; })   
      .parentId(function(d) { return d.name; })   
      (data2);
    root.sum(function(d) { return +d.amount  })   
    d3.treemap()
      .size([w-100, h])
      .padding(2)
      (root)
  
    // use this information to add rectangles:
    svg2
      .selectAll("rect")
      .data(root.leaves())
      .join("rect")
      .transition()
      .duration(1000)
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .attr("fill", function(d) {
          return Coscale(Math.round((d.y1-d.y0)+(d.x1-d.x0)))
         })
         .transition()
        .duration(1000);
  
    // and to add the text labels
    svg2
      .selectAll("text")
      .data(root.leaves())
      .join("text")
        .attr("x", function(d){ return d.x0+8})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+20})
        .text(function(d){ return ((d.x1 - d.x0) >40 && (d.y1 - d.y0)>20 ) ? d.data['listed_in'] : ''; })
        .attr("font-size",function(d){ return ((d.x1 - d.x0)>125 && (d.y1 - d.y0)>50) ? '16px' : (d.x1 - d.x0)/11+'px'})
        .attr("fill", "white")
        
        }
      });
    

  })

}(d3))

