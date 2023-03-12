(function (d3) { 
  'use strict';
  const margin = {top: 10, right: 30, bottom: 20, left: 50};
  const width = 720 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;

  const svg = d3.select("#my_dataviz5")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",`translate(${margin.left},${margin.top})`);

  const svg2 = d3.select("#my_dataviz5")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform",`translate(${margin.left},${margin.top})`);

  const barSize = 48
  const n = 12

  Promise.all([d3.csv("https://raw.githubusercontent.com/casihoicho/DSDV-repo/Duy/data/rating1%20(1).csv"),
                d3.csv("https://raw.githubusercontent.com/casihoicho/DSDV-repo/Duy/data/rating2%20(1).csv"),
                d3.csv("https://raw.githubusercontent.com/casihoicho/DSDV-repo/Duy/data/type.csv")])
          .then(function(data) {
            const subgroups = data[2].columns.slice(1)
            console.log(subgroups);
            const groups = data[2].map(d => d.year)
            console.log(groups)

            const y = d3.scaleBand()
                        .domain(groups)
                        .range([height,0])
                        .padding([.5])

            let x = d3.scaleLinear()
                      .domain([0, 1350])
                      .range([ 0, width]);
            svg.append("g")
                .call(d3.axisLeft(y));

            let xaxis = svg.append("g")
                            .attr("transform", `translate(0, ${height})`)
                            .call(d3.axisBottom(x).tickSize(5))

            const ySubgroup = d3.scaleBand()
                                .domain(subgroups)
                                .range([y.bandwidth(),0])
                                .padding([0.05])

            const color = d3.scaleOrdinal()
                            .domain(subgroups)
                            .range(['#D62A28', "#262626"])

            var bar = svg.append("g")
                          .selectAll("g")
                          .data(data[2])
                          .join("g")
                          .attr("transform", d => `translate(0,${y(d.year)})`)
                          .selectAll("rect")
                          .data(function(d) {
                            return subgroups.map(key => ({key, value: d[key]}));
                          })
                          .join("rect")
                          .attr("x", x(0))
                          .attr("y", d => ySubgroup(d.key))
                          .attr("width",d => x(d.value) - x(0))
                          .attr("height",  ySubgroup.bandwidth())
                          .attr("fill", d => color(d.key))
                          .on("mouseover", function() {
                            d3.select(this)
                              .append("title")
                              .text(function(d) {
                                return d.key + ": " +parseInt(d.value);
                              });
                          })
                          .on("mouseout", function() {
                            d3.select(this)
                              .transition()
                              .duration(150)
                          })
                          .on("click", function(d) {
                            let type, value, dat, color
                            d3.select(this)
                              .append("title")
                              .text(function(d) {
                                type = d.key, value = d.value;
                                return d.key + ", " +d.value
                              })

                            let year = data[2].find(x => x[type] === value).year;

                            if (type === "Movie") {
                              dat = data[0].find(x => x.year === year);
                              color='#D62A28';
                            }

                            if  (type === "TV Show") {
                              dat = data[1].find(x => x.year === year);
                              color='#262626';
                            }
        
                            let output1 = Object.entries(dat).map(([key, value]) => ({key,value}));
        
                            let output = output1.map(function(d) {
                              return {
                                key: d.key,
                                value: parseInt(d.value)
                              };
                            })

                            output = output.filter(d => d.value < 1500)

                            output.sort(function(b, a) {
                              return a.value - b.value;
                            });

                            output = output.slice(0, 5);
                            let group = output.map(d => d.key);

                            svg2.selectAll("*")
                                .remove();

                            let x0 = d3.scaleLinear()
                                        .domain([0, d3.max(output, function(d) {
                                          return d.value;
                                        })])
                                        .range([ 0, width]);
                            svg2.append("g")
                                .attr("transform", `translate(0, ${height})`)
                                .call(d3.axisBottom(x0).tickFormat(function(e) {
                                  if(Math.floor(e) != e) {
                                    return;
                                  }
                                  return e;
                                }))
                                .selectAll("text")
                                .style("text-anchor", "middle")
                                .transition()
                                .duration(1000);
      
                            let y0 = d3.scaleBand()
                                        .range([0, height])
                                        .domain(group)
                                        .padding(1);

                            svg2.append("g")
                                .call(d3.axisLeft(y0))
                                .transition()
                                .duration(1000);

                            svg2.selectAll("myline")
                                .data(output)
                                .enter()
                                .append("line")
                                .attr("x1", function(d) {
                                  return x0(d.value);
                                })
                                .attr("x2", x0(0))
                                .attr("y1", function(d) {
                                  return y0(d.key);
                                })
                                .attr("y2", function(d) {
                                  return y0(d.key);
                                })
                                .attr("stroke", "grey")
                                .transition()
                                .duration(1000);

                            svg2.selectAll("mycircle")
                                .data(output)
                                .enter()
                                .append("circle") 
                                .attr("cx", function(d) {
                                  return x0(d.value);
                                })
                                .attr("cy", function(d) {
                                  return y0(d.key);
                                })
                                .attr("r", "4")
                                .style("fill", color)
                                .attr("stroke", "black")
                                .transition()
                                .duration(1000);
          
                            let ticker = svg2.append("text")
                                              .attr("x", width / 1.4)
                                              .attr("y", height / 1.2)
                                              .attr("text-anchor", "middle")
                                              .style("font-size", "30px")
                                              .text(type + " - " + year);
                          })


            function changeSize(size) {
              x.domain([0, 1300 / size]);

              xaxis.call(d3.axisBottom(x))

              bar.attr("width",d => (x(d.value)-x(0)))
            }

            d3.select("#mySlider")
              .on("change", function(d) {
                let selectedValue = this.value
                changeSize(selectedValue)
            })
          })
} (d3))