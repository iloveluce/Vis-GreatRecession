 
//axis titles
smalllinegraph.statistics = ["busBankr", "crime", "gsp", "home", "unemp"]

smalllinegraph.graphtitle = {"busBankr": "Bankruptcy", "crime":"Crime", "gsp":"GSP", "home":"Homeowner", "unemp":"Unemployment"}
//var axistitle = {"unemp": "Unemployment Rate", "vc": "# of Venture Capital Deals", "crime": "Robbery Rate per 100,000ppl",
//"gsp": "Real Gross State Product per 100,000ppl", "home": "Vacancy Rate per 100 Houses"}


////////////////////////////////////////////
//              Define function to         //
//              create line graph m        //
/////////////////////////////////////////////
function updatesmallline (statistic){




json = [];
smalllinegraph.svg.selectAll(".stateline, .usline").each(function(d){
    json.push(d);
})


for (var index in smalllinegraph.statistics) {
  
  var statisticcomp = smalllinegraph.statistics[index]

var min = d3.min(json, function(data) { return d3.min(data[statisticcomp], function(d){
return parseInt(d);})});

var max = d3.max(json, function(data) { return d3.max(data[statisticcomp], function(d){return parseFloat(d);})});
smalllinegraph.y.domain([min, max]);

d3.select("."+statisticcomp+"yaxis")
        .transition()
        .duration(1000)
        .call(smalllinegraph.yAxis);

d3.selectAll("."+statisticcomp+"smline")
    .transition()
    .duration(1000)
    .attr("d", function(d){
      return smalllinegraph.line(d[statisticcomp])})

}
}



////////////////////////////////////////////
//              Define function to         //
//              update line graph         //
/////////////////////////////////////////////

function initializesmallline(json){

smalllinegraph.parseDate = d3.time.format("%Y").parse;

smalllinegraph.json = json;
smalllinegraph.x = d3.time.scale()
    .range([0, width.smalllinegraph ]);

smalllinegraph.y = d3.scale.linear()
    .range([height.smalllinegraph, 0]);

smalllinegraph.xAxis = d3.svg.axis()
    .scale(smalllinegraph.x)
    .ticks(4)
    //.tickValues([2001, 2005, 2011])
    .orient("bottom");

smalllinegraph.yAxis = d3.svg.axis()
    .scale(smalllinegraph.y)
    .ticks(5)
    .tickFormat(d3.format("s"))
    .orient("left");

   

smalllinegraph.missstatistic = "unemp";

smalllinegraph.line = d3.svg.line()
    .x(function(d, i) {  return smalllinegraph.x(smalllinegraph.parseDate(json[0]["year"][i])); })
    .y(function(d, i) {  return smalllinegraph.y(d); });


smalllinegraph.x.domain(d3.extent(json[0].year, function(d) {return smalllinegraph.parseDate(d); }));
//var index = 0;
 //var bottomfix = 0;
for (var index in smalllinegraph.statistics) {
  
  var statistic = smalllinegraph.statistics[index]
//  if(statistic == smalllinegraph.missstatistic){
  //  index--
    //continue;
  //}

  //if(index == 3)
    //bottomfix = 30

//console.log(statistic)
smalllinegraph.svg = d3.select("div#svg-sline" + index).append("svg")
    .attr("width", width.smalllinegraph + margin.smalllinegraph.left + margin.smalllinegraph.right)
    .attr("height", height.smalllinegraph + margin.smalllinegraph.top + margin.smalllinegraph.bottom )
    .attr("class", statistic)
    .append("g")
    .attr("transform", "translate(" + margin.smalllinegraph.left + "," + margin.smalllinegraph.top + ")");




//smalllinegraph.y.domain(d3.extent(json[0][statistic], function(d) {return d; }));
var min = d3.min(json, function(data) { return d3.min(data[statistic], function(d){
return parseFloat(d);})});
var max = d3.max(json, function(data) { return d3.max(data[statistic], function(d){
return parseFloat(d);})});

smalllinegraph.y.domain([min, max]);


smalllinegraph.svg.append("text")
        .attr("x", (width.smalllinegraph / 2))             
        .attr("y", 0 - (margin.smalllinegraph.top / 2) - 10)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("font-weight", "bold")  
        .text(longgraphtitlest[statistic]);

  smalllinegraph.svg.append("text")
        .attr("x", (width.smalllinegraph / 2))             
        .attr("y", 0 - (margin.smalllinegraph.top / 2) + 10)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        //.style("text-decoration", "underline")  
        .text(longgraphtitleen[statistic]);


  smalllinegraph.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height.smalllinegraph )  + ")")
        .call(smalllinegraph.xAxis)
  

smalllinegraph.svg.append("g")
    .attr("class", "y axis " +statistic+"yaxis")
    .call(smalllinegraph.yAxis)
    

  
json.forEach(function(d,i){
    smalllinegraph.svg.append("path")
          .datum(json[i][statistic])
          .attr("class", function(d){
            if(json[i].code == "US")
            return "line allstateline usline stateline " +  json[i].code +" "+ statistic +"smline" 
          else
            return "line allstateline stateline " +  json[i].code +" "+ statistic +"smline" })
          .attr("line-statecode",  json[i].code)
          .attr("d", smalllinegraph.line)
          .on("click", function(d){
            zoom(d3.select(".map"+"."+d.code)[0][0]["__data__"]);
            // $(".map"+"."+d.code)[0].click()
          })
          .datum(json[i])
})

//Bring US to front
d3.selectAll(".US").moveToFront();

 
}
updateMapColors("Unemployment")
}
