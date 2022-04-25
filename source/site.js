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


   let data2=[]
  var rowConverter = function(d) {
    return {
      cast:d.cast,
      Country:d['country'],
      date_added: Date.parse(d['date_added']),
      description:d.description,
      director:d.director,
      duration: parseFloat(d['duration']),
      listed_in:d.listed_in,
      month_added: parseFloat(d['month_added']),
      rating:d.rating,
      release_year:d.release_year,
      season_count:parseFloat(d['season_count']),
      show_id: parseInt(d['show_id']),
      title:d.title,
      type:d.type,
      year_added: parseFloat(d['year_added']),
    };
   }
 
 

let data=[];
    d3.csv("https://raw.githubusercontent.com/casihoicho/DSDV-repo/main/netflix_titles_modified.csv", rowConverter).then(function(data) {
    
    console.log(data[3])
  })
  
}(d3))