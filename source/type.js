(function (d3) { 
  'use strict';
  const margin = {top: 10, right: 30, bottom: 20, left: 50},
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#chart1")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",`translate(${margin.left},${margin.top})`);
  
  var overall = document.getElementById("Overall");
overall.addEventListener("click", function() {
	svg.selectAll("*").remove();


// Parse the Data
d3.csv("https://raw.githubusercontent.com/casihoicho/DSDV-repo/Duy/data/type.csv").then( function(data) {

// List of subgroups = header of the csv files = soil condition here
const subgroups = data.columns.slice(1)

// List of groups = species here = value of the first column called group -> I show them on the X axis
const groups = data.map(d => d.year)

console.log(groups)

// Add X axis
const x = d3.scaleBand()
    .domain(groups)
    .range([0, width])
    .padding([0.2])
svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x).tickSize(0));

// Add Y axis
const y = d3.scaleLinear()
  .domain([0, 1300])
  .range([ height, 0 ]);
svg.append("g")
  .call(d3.axisLeft(y));

// Another scale for subgroup position?
const xSubgroup = d3.scaleBand()
  .domain(subgroups)
  .range([0, x.bandwidth()])
  .padding([0.05])

// color palette = one color per subgroup
const color = d3.scaleOrdinal()
  .domain(subgroups)
  .range(['#377eb8','#4daf4a'])

// Show the bars
svg.append("g")
  .selectAll("g")
  // Enter in data = loop group per group
  .data(data)
  .join("g")
    .attr("transform", d => `translate(${x(d.year)}, 0)`)
  .selectAll("rect")
  .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
  .join("rect")
    .attr("x", d => xSubgroup(d.key))
    .attr("y", d => y(d.value))
    .attr("width", xSubgroup.bandwidth())
    .attr("height", d => height - y(d.value))
    .attr("fill", d => color(d.key));

})
}, false);

var movie = document.getElementById("Movie");
movie.addEventListener("click", function() {
   svg.selectAll("*").remove();

  d3.csv("https://raw.githubusercontent.com/casihoicho/DSDV-repo/Duy/data/rating1%20(1).csv").then( function(data) {

    //   // List of subgroups = header of the csv files = soil condition here
const subgroups = data.columns.slice(1)
//   // List of groups = species here = value of the first column called group -> I show them on the X axis
const groups = data.map(d => d.year)
  // Add X axis
  const x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.3])
  svg.append("g")
  .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 1200])
    .range([ height, 0 ]);
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

    // const tooltip = d3.select("#my_dataviz5")
    // .append("div")
    // .style("opacity", 0)
    // .attr("class", "tooltip")
    // .style("background-color", "white")
    // .style("border", "solid")
    // .style("border-width", "1px")
    // .style("border-radius", "5px")
    // .style("padding", "10px")

 let mouseleave =function (event,d) { // When user do not hover anymore

  // Back to normal opacity: 1
  d3.selectAll(".myRect")
  .style("opacity",1)
}

let mouseover =function (event,d) { // What happens when user hover a bar

  // what subgroup are we hovering?
  var subgroupName = d3.select(this.parentNode).datum().key
  var subgroupValue = d.data[subgroupName];
// tooltip
//     .html("status: " + subgroupName + "<br>" + "Value: " + subgroupValue)
//     .style("opacity", 1)

  // Reduce opacity of all rect to 0.2
   d3.selectAll(".myRect").style("opacity", 0.2)

  // Highlight all rects of this subgroup with opacity 1. It is possible to select them since they have a specific class = their name.
   d3.selectAll("."+subgroupName).style("opacity",1)
}



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
        .attr("x", d => x(d.data.year))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width",x.bandwidth())
        .attr("stroke", "grey")
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)
})
  
}, false);
      
var tvshow = document.getElementById("TV show");
tvshow.addEventListener("click", function() {
   svg.selectAll("*").remove();

  d3.csv("https://raw.githubusercontent.com/casihoicho/DSDV-repo/Duy/data/rating2%20(1).csv").then( function(data) {

    //   // List of subgroups = header of the csv files = soil condition here
const subgroups = data.columns.slice(1)
//   // List of groups = species here = value of the first column called group -> I show them on the X axis
const groups = data.map(d => d.year)
  // Add X axis
  const x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.3])
  svg.append("g")
  .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 1200])
    .range([ height, 0 ]);
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

    // const tooltip = d3.select("#my_dataviz5")
    // .append("div")
    // .style("opacity", 0)
    // .attr("class", "tooltip")
    // .style("background-color", "white")
    // .style("border", "solid")
    // .style("border-width", "1px")
    // .style("border-radius", "5px")
    // .style("padding", "10px")

 let mouseleave =function (event,d) { // When user do not hover anymore

  // Back to normal opacity: 1
  d3.selectAll(".myRect")
  .style("opacity",1)
}

let mouseover =function (event,d) { // What happens when user hover a bar

  // what subgroup are we hovering?
  var subgroupName = d3.select(this.parentNode).datum().key
  var subgroupValue = d.data[subgroupName];
// tooltip
//     .html("status: " + subgroupName + "<br>" + "Value: " + subgroupValue)
//     .style("opacity", 1)

  // Reduce opacity of all rect to 0.2
   d3.selectAll(".myRect").style("opacity", 0.2)

  // Highlight all rects of this subgroup with opacity 1. It is possible to select them since they have a specific class = their name.
   d3.selectAll("."+subgroupName).style("opacity",1)
}



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
        .attr("x", d => x(d.data.year))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width",x.bandwidth())
        .attr("stroke", "grey")
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)
})
  
}, false);

  }(d3))