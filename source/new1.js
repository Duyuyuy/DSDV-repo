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


  const groups = data.map(d => d.year_added)

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
          .range(["#D62A28",'#262626']);
    

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
          .transition()
          .delay(800)          
          .duration(2000)
          .attr("class", d => d.name)
            .attr("d", d => line(d.values))
            .attr("stroke", d => myColor(d.name))
            .style("stroke-width", 2)
            .style("fill", "none")
;
    
    
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
                  .attr('x', (d,i) => 40 + i*70)
                  .attr('y', 40)
                  .text(d => d.name.toUpperCase())
                  .style("fill", d => myColor(d.name))
                  .style("font-size", 28)
                .on("click", function(event,d){
                let currentOpacity = d3.selectAll("." + d.name).style("opacity")
                console.log(currentOpacity)
                  d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1)




        
                 
    })


})
}(d3))