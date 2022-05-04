(function (d3) { 
    'use strict';
    const margin = {top: 10, right: 30, bottom: 20, left: 50},
    w = 1000 - margin.left - margin.right,
    h = 1200 - margin.top - margin.bottom;


// append the svg object to the body of the page
const svg = d3.select("body")
  .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("https://raw.githubusercontent.com/casihoicho/DSDV-repo/Duy/output%20(1).csv").then( function(data) {

  // List of subgroups = header of the csv files = soil condition here
  const subgroups = data.columns.slice(1)
console.log(subgroups)
  // List of groups = species here = value of the first column called group -> I show them on the X axis
  const groups = data.map(d => d.year_added)
console.log(groups)
  // Add X axis
  const x = d3.scaleBand()
      .domain(groups)
      .range([0, w])
      .padding([0.3])
  svg.append("g")
  .attr("transform", `translate(0, ${h})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 1200])
    .range([ h, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette = one color per subgroup
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(d3.schemeSet2);

  //stack the data? --> stack per subgroup
  const stackedData = d3.stack()
    .keys(subgroups)
    (data)

    const tooltip = d3.select("body")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

 let mouseleave =function (event,d) { // When user do not hover anymore

  // Back to normal opacity: 1
  d3.selectAll(".myRect")
  .style("opacity",1)
}

let mouseover =function (event,d) { // What happens when user hover a bar

  // what subgroup are we hovering?
  var subgroupName = d3.select(this.parentNode).datum().key
  var subgroupValue = d.data[subgroupName];
tooltip
    .html("status: " + subgroupName + "<br>" + "Value: " + subgroupValue)
    .style("opacity", 1)

  // Reduce opacity of all rect to 0.2
   d3.selectAll(".myRect").style("opacity", 0.2)

  // Highlight all rects of this subgroup with opacity 1. It is possible to select them since they have a specific class = their name.
   d3.selectAll("."+subgroupName).style("opacity",1)
}



// Three function that change the tooltip when user hover / move / leave a cell
// var mouseover = function(event, d) {
// var subgroupName = d3.select(this.parentNode).datum().key;
// var subgroupValue = d.data[subgroupName];
// tooltip
//     .html("status: " + subgroupName + "<br>" + "Value: " + subgroupValue)
//     .style("opacity", 1)
// }
// var mouseleave = function(event, d) {
// tooltip
//   .style("opacity", 0)
// }




  // ----------------
  // Highlight a specific subgroup when hovered
  // ----------------

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .join("g")
      .attr("fill", d => color(d.key))
      .attr("class", d => "myRect " + d.key ) // Add a class to each subgroup: their name
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(d => d)
      .join("rect")
        .attr("x", d => x(d.data.year_added))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width",x.bandwidth())
        .attr("stroke", "grey")
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)

})
}(d3))