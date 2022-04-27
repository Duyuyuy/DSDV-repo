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
    
    // Data and color scale
    const data = new Map();
    const colorScale = d3.scaleThreshold()
      .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
      .range(d3.schemeBlues[7]);


   let data2=[]
  var rowConverter = function(d) {
    return {
      show_id: parseInt(d['show_id']),
      title:d.title,
      type:d.type,
      duration: parseFloat(d['duration']),
      season_count:parseFloat(d['season_count']),
      rating:d.rating,
      cast:d.cast,
      Country:d['country'],
      listed_in:d.listed_in,
      description:d.description,
      release_year:d.release_year,
      year_added: parseFloat(d['year_added']),
      status: d.status
    };
   }
 
 



    
   
    
    
    // Load external data and boot
    // Promise.all([
    // d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
    d3.csv("https://raw.githubusercontent.com/casihoicho/DSDV-repo/uyen/netflix_titles_html.csv",rowConverter).then(function(data) {
      d3.csv("https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.csv",rowConverter).then(function(data2){
     let Country=data.map(d=> d['Country'].split(', '));
     let countCountry=[];
     Country.map(d=> d.map(x=> countCountry.push(x)));
     countCountry=countCountry.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    countCountry=Object.entries(countCountry);
    countCountry=countCountry.map(d => d.reduce((accumulator, value, index) => {
      return { ['Country']: accumulator,['freq']: value};
    }))
    console.log(countCountry);

    //  let topo = countCountry;
    
  });
});
}(d3))