// Initialization Function: initializeTooltip();
// The initialization function is called in main.js. All tooltip code is contained within this file.



function initializeTooltip(json){
d3.selectAll(".map.state, .parallel.foreground, .stateline")
 .on("mouseover", function(d,i){
    var stateid;
    //check if it exist
    if(d)
    {
      if(d.properties)
        stateid = d.properties.code;
      else
        stateid= d.code
      if(d3.select("[line-statecode="+stateid+"]")[0][0].classList.contains("stateline") || d3.select("[line-statecode="+stateid+"]")[0][0].classList.contains("usline") )
      {
        if(!map.zoomed){
          d3.selectAll("[line-statecode="+stateid+"]").classed("selectedline", true).moveToFront();
          d3.selectAll("[data-statecode=" +stateid+"]").classed("selectedline", true)
        }
        toolTipStart(d);
      }
    }
  })
  .on("mousemove", function(d,i){
    toolTipMove(d);
  })
  .on("mouseout", function(d,i){
    var stateid;
      if(d)
      {
        if(d.properties)
          stateid = d.properties.code;
        else
          stateid= d.code
          d3.selectAll("[line-statecode="+stateid+"]").classed("selectedline", false);
          d3.selectAll("[data-statecode=" +stateid+"]").classed("selectedline", false)
           toolTipStop(d); 
      }
    })
   .on("click", function(d){
            console.log(d)
           if(d){
            if(d.code)
              zoom(d3.select(".map"+"."+d.code)[0][0]["__data__"]);
            else
              zoom(d);
          }
    
          });


  tooltip = d3.select("#svg-map").append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .html("<div id='tooltipDiv'></div>")
    .style("color", "black")
    .style("background-color", "beige")
    .style("border", "2px solid black")
    .style("margin", "10px")
    .style("padding", "10px")
    .style("z-index", "10")
    .style("opacity", "1");

}
var debugDog;

function toolTipStart(data){
    tooltip.style("visibility", "visible")
      // .html( data.name || data.properties.name)
      .html(function(){
        var statecode = data.code || data.properties.code;
        var statename = data.name || data.properties.name;
        var yearObjectNumber = linegraph.value - 2001;
        var currentIndicator = d3.selectAll(".parallel.dimension g.parallel.axis text.active[text-anchor = 'middle']").data()[0];
        var currentData = debugData[yearObjectNumber]
        .states
        .filter(function(theState){
          if (theState.code == statecode){
            return true;
          }})[0][currentIndicator];
        //console.log(currentData);
        console.log(data);
        if(data.year && data.year instanceof Array){
          return ""+statename;
        } else {
          return ""+statename+": "+currentData + " " + (d3.select(".parallel.dimension g.parallel.axis text.active[text-anchor = 'middle']").text()!="Unemployment" ? d3.select("#legend_info").text() : "%");
        }
      })
      .style("background-color", "white")
      .style("opacity", "0")
      .style("top", (event.pageY-100)+"px")
      .style("left", (event.pageX-100)+"px")
}

function toolTipMove(data){   
    tooltip
      .style("top", (+event.pageY-150)+"px")
      .style("left", (+event.pageX-100)+"px")
      .style("opacity", "0.9");
}

function toolTipStop(data){
  tooltip
    .style("visibility", "hidden")
    .html("");
}



///////////////////////////////////////////////
//              Popup Graph                  //
///////////////////////////////////////////////


//TODO : Change diffs in main js file
function initializeTooltipGraph(data){

    
  
  // tooltip.x.domain(data.map(function(d) { return d.name; }));
  // toolip.y.domain(d3.extent(data, function(d) { return d.value; })).nice();

  // tooltip.svg = tooltip.append("svg")
  //   .attr("width", width.tooltip + margin.tooltip.left + margin.tooltip.right)
  //   .attr("height", height.tooltip + margin.tooltip.top + margin.tooltip.bottom)
  // .append("g")
  //   .attr("transform", "translate(" + margin.tooltip.left + "," + margin.tooltip.top + ")");

  // tooltip.svg.selectAll(".bar")
  //   .data(jsonFile)
  // .enter().append("rect")
  //   .attr("class", function(d) { return +d.value < 0 ? "bar negative" : "bar positive"; })
  //   .attr("x", function(d) { return x(Math.min(0, d.value)); })
  //   .attr("y", function(d) { return y(d.name); })
  //   .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
  //   .attr("height", y.rangeBand());

    
    tooltip.x = d3.scale.linear()
        .range([0, tooltip.width])

    tooltip.y = d3.scale.ordinal()
        .rangeRoundBands([0, tooltip.height], .2);

    tooltip.xAxis = d3.svg.axis()
        .scale(tooltip.x)
        .orient("top");

    tooltip.svg = d3.select("#tooltipDiv").append("svg")
        .attr("width", tooltip.width + margin.tooltip.left + margin.tooltip.right)
        .attr("height", tooltip.height + margin.tooltip.top + margin.tooltip.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.tooltip.left + "," + margin.tooltip.top + ")");

      x.domain(d3.extent(data, function(d) { return d.value; })).nice();
      y.domain(data.map(function(d) { return d.name; }));

      svg.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", function(d) { return d.value < 0 ? "bar negative" : "bar positive"; })
          .attr("x", function(d) { return x(Math.min(0, d.value)); })
          .attr("y", function(d) { return y(d.name); })
          .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
          .attr("height", y.rangeBand());

      svg.append("g")
          .attr("class", "x axis")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
        .append("line")
          .attr("x1", x(0))
          .attr("x2", x(0))
          .attr("y2", height);


    function type(d) {
      d.value = +d.value;
      return d;
    }


}