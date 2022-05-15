(function (d3) { 
    'use strict';
    const margin = {top: 10, right: 30, bottom: 20, left: 50},
    w = 700 - margin.left - margin.right,
    h = 800 - margin.top - margin.bottom;


// append the svg object to the body of the page
const svg3 = d3.select("#my_dataviz3")
  .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("https://raw.githubusercontent.com/casihoicho/DSDV-repo/Duy/data/output%20(1).csv").then( function(data) {

//   // List of subgroups = header of the csv files = soil condition here
//   const subgroups = data.columns.slice(1)
//   // List of groups = species here = value of the first column called group -> I show them on the X axis
  const groups = data.map(d => d.year_added)
//   // Add X axis
//   const x = d3.scaleBand()
//       .domain(groups)
//       .range([0, w])
//       .padding([0.3])
//   svg3.append("g")
//   .attr("transform", `translate(0, ${h})`)
//     .call(d3.axisBottom(x).tickSizeOuter(0));

//   // Add Y axis
//   const y = d3.scaleLinear()
//     .domain([0, 1200])
//     .range([ h, 0 ]);
//   svg3.append("g")
//     .call(d3.axisLeft(y));

//   // color palette = one color per subgroup
//   const color = d3.scaleOrdinal()
//     .domain(subgroups)
//     .range(d3.schemeSet2);

//   //stack the data? --> stack per subgroup
//   const stackedData = d3.stack()
//     .keys(subgroups)
//     (data)

//     const tooltip = d3.select("#my_dataviz3")
//     .append("div")
//     .style("opacity", 0)
//     .attr("class", "tooltip")
//     .style("background-color", "white")
//     .style("border", "solid")
//     .style("border-width", "1px")
//     .style("border-radius", "5px")
//     .style("padding", "10px")

//  let mouseleave =function (event,d) { // When user do not hover anymore

//   // Back to normal opacity: 1
//   d3.selectAll(".myRect")
//   .style("opacity",1)
// }

// let mouseover =function (event,d) { // What happens when user hover a bar

//   // what subgroup are we hovering?
//   var subgroupName = d3.select(this.parentNode).datum().key
//   var subgroupValue = d.data[subgroupName];
// tooltip
//     .html("status: " + subgroupName + "<br>" + "Value: " + subgroupValue)
//     .style("opacity", 1)

//   // Reduce opacity of all rect to 0.2
//    d3.selectAll(".myRect").style("opacity", 0.2)

//   // Highlight all rects of this subgroup with opacity 1. It is possible to select them since they have a specific class = their name.
//    d3.selectAll("."+subgroupName).style("opacity",1)
// }



//   svg3.append("g")
//     .selectAll("g")
//     // Enter in the stack data = loop key per key = group per group
//     .data(stackedData)
//     .join("g")
//       .attr("fill", d => color(d.key))
//       .attr("class", d => "myRect " + d.key ) // Add a class to each subgroup: their name
//       .selectAll("rect")
//       // enter a second time = loop subgroup per subgroup to add all rectangles
//       .data(d => d)
//       .join("rect")
//         .attr("x", d => x(d.data.year_added))
//         .attr("y", d => y(d[1]))
//         .attr("height", d => y(d[0]) - y(d[1]))
//         .attr("width",x.bandwidth())
//         .attr("stroke", "grey")
//         .on("mouseover", mouseover)
//         .on("mouseleave", mouseleave)




        const allGroup = ["old", "new"];


        const dataReady = allGroup.map( function(grpName) { 
          return {
            name: grpName,
            values: data.map(function(d) {
              return {year: new Date(d.year_added), value: +d[grpName]};
            })
          };
        });
    
        console.log(dataReady);
    
    
        const myColor = d3.scaleOrdinal()
          .domain(allGroup)
          .range(d3.schemeSet2);
    

      var x = d3.scaleTime()
      .range([0, w])
      .domain(d3.extent(data, function(d) { return new Date(d.year_added); }));
      
      var xaxis=d3.axisBottom(x).tickFormat(d3.timeFormat("%Y"))
        svg3.append("g")
          .attr("transform", `translate(0, ${h})`)
          .call(xaxis.ticks(d3.timeYear))
          ;

    
        var y = d3.scaleLinear()
          .range([h, 0])    
          .domain([0, 1250]);
        svg3.append("g")
          .call(d3.axisLeft(y));
          
    
    
        const line = d3.line()
        .x(d => x(+d.year))
        .y(d => y(+d.value))
       
        svg3.selectAll("myLines")
          .data(dataReady)
          .join("path")
          .attr("class", d => d.name)
            .attr("d", d => line(d.values))
            .attr("stroke", d => myColor(d.name))
            .style("stroke-width", 2)
            .style("fill", "none")
    
    
        svg3
     
          .selectAll("myDots")
          .data(dataReady)
          .join('g')
          .style("fill", d => myColor(d.name))
          .attr("class", d => d.name)
          .selectAll("myPoints")
          .data(d => d.values)
          .join("circle")
            .attr("cx", d => x(d.year))
            .attr("cy", d => y(d.value))
            .attr("r", 8)

            .on("mouseover", function() {
              d3.select(this)
              .attr('stroke', d => myColor(d.name))
              .append("title")
              .text(function(d) {
                return d.value;
              });
             })
             .on("mouseout", function() {
              d3.select(this)
              .attr('stroke', 'none')
              .transition()
              .duration(150)
             });
    
              svg3
              .selectAll("myLegend")
              .data(dataReady)
              .join('g')
                .append("text")
                  .attr('x', (d,i) => 40 + i*60)
                  .attr('y', 40)
                  .text(d => d.name)
                  .style("fill", d => myColor(d.name))
                  .style("font-size", 30)
                .on("click", function(event,d){
                  let currentOpacity = d3.selectAll("." + d.name).style("opacity")
                  d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1)
        
              
    })
    

})
}(d3))