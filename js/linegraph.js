
   
//axis titles
var axistitle = {"unemp": "Unemployment Rate", "busBankr": "Business Bankruptcy rate per 100,000ppl", "crime": "Robbery Rate per 100,000ppl",
"gsp": "Real Gross State Product per 100,000ppl", "home": "Vacancy Rate per 100 Houses"}


////////////////////////////////////////////
//              Define function to         //
//              create line graph m        //
/////////////////////////////////////////////
function updateline (statistic){



// for when we want to update but not change statistic
if(statistic){   
  linegraph.statistic = statistic;
}
else
    statistic = linegraph.statistic;

json = [];
linegraph.svg.selectAll(".stateline, .usline").each(function(d){
    json.push(d);
})



var min = d3.min(json, function(data) { return  d3.min(data[statistic], function(d){return parseFloat(d);})});

var max = d3.max(json, function(data) { return d3.max(data[statistic], function(d){return parseFloat(d);})});



linegraph.y.domain([min, max]);

linegraph.svg.select(".yaxis")
        .transition()
        .duration(1000)
        .call(linegraph.yAxis);

linegraph.svg.selectAll(".stateline, .usline")
    .transition()
    .duration(1000)
    .attr("d", function(d){return linegraph.line(d[statistic])})



linegraph.svg.select("#yaxistitle")
        .transition()
        .text(axistitle[statistic]);
}




////////////////////////////////////////////
//              Define function to         //
//              update line graph         //
/////////////////////////////////////////////

function initializeline(json, statistic, json2){

linegraph.parseDate = d3.time.format("%Y").parse;

linegraph.x = d3.time.scale()
    .range([0, width.linegraph ]);

linegraph.y = d3.scale.linear()
    .range([height.linegraph, 0]);

linegraph.xAxis = d3.svg.axis()
    .scale(linegraph.x)
    .orient("bottom");

linegraph.yAxis = d3.svg.axis()
    .scale(linegraph.y)
    .orient("left");

 linegraph.brush = d3.svg.brush()
    .x(linegraph.x)
    .extent([0, 0])
    .on("brush", brushed)
    .on("brushend", function(){
      updateParallel(json2, linegraph.value)
    });


linegraph.statistic = statistic;

linegraph.line = d3.svg.line()
    .x(function(d, i) {  return linegraph.x(linegraph.parseDate(json[0]["year"][i])); })
    .y(function(d, i) {  return linegraph.y(d); });

linegraph.svg = d3.select("div#svg-line").append("svg")
    .attr("width", width.linegraph + margin.linegraph.left + margin.linegraph.right)
    .attr("height", height.linegraph + margin.linegraph.top + margin.linegraph.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.linegraph.left + "," + margin.linegraph.top + ")");



linegraph.x.domain(d3.extent(json[0].year, function(d) {return linegraph.parseDate(d); }));
//linegraph.y.domain(d3.extent(json[0][statistic], function(d) {return d; }));
var min = d3.min(json, function(data) { return d3.min(data[statistic], function(d){
return d;})});
var max = d3.max(json, function(data) { return d3.max(data[statistic], function(d){
return d;})});

linegraph.y.domain([min, max]);

 
linegraph.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height.linegraph + ")")
      .call(linegraph.xAxis)


 linegraph.slider = linegraph.svg.append("g")
    .attr("class", "slider")
    .attr("height", "30")
    .call(linegraph.brush)
   

    linegraph.slider.selectAll("rect")
     .attr("y", height.linegraph-15)
      .attr("height", 25);

  linegraph.slider .selectAll(".extent,.resize")
    .remove();

linegraph.slider.select(".background")
    .attr("height", height.linegraph);

linegraph.handle = linegraph.slider.append("circle")
    .attr("class", "handle")
    .attr("transform", "translate(0," + height.linegraph + ")")
    .attr("r", 9);


 

linegraph.svg.append("text")    
      .attr("text-anchor", "middle") 
      .attr("class", "axistitle") 
      .attr("transform", "translate("+ (width.linegraph/2) +","+ (height.linegraph+ margin.linegraph.bottom ) +")")  
      .text("Year");

linegraph.svg.append("g")
    .attr("class", "y axis yaxis")
    .call(linegraph.yAxis)
    .append("text")
    .attr("class", "axistitle yaxis")
    .attr("id", "yaxistitle")
    .attr("transform", "translate("+ (-margin.linegraph.left/1.5) +","+(height.linegraph/2)+")rotate(-90)")
    .style("text-anchor", "middle")
   .text(axistitle[statistic]);

  
json.forEach(function(d,i){
    linegraph.svg.append("path")
          .datum(json[i][statistic])
          .attr("class", function(d){
          if(json[i].code == "US")
            return "line allstateline usline stateline " +  json[i].code 
          else
            return "line allstateline stateline " +  json[i].code })
          .attr("line-statecode",  json[i].code)
          .attr("d", linegraph.line)
          .datum(json[i])

    //updateMapColors(statistic);
})


function brushed() {

  var value = linegraph.brush.extent()[0];

  if (d3.event.sourceEvent) { // not a programmatic event
    value = linegraph.x.invert(d3.mouse(this)[0]);
    linegraph.brush.extent([value, value]);
  }

  linegraph.handle.attr("cx", linegraph.x(value))
  linegraph.value =value.getFullYear();

}

}
