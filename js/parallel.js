
   
//axis titles
parallel.axistitle = {"Unemployment": "Unemployment", "HomeownerRates": "Home Vacancy", "busBankr": "Bankruptcy",
"GSP": "Gross State Product", "burg_rate": "Burglary"}


/////////////////////////////////////////////
//              Define function to         //
//          draw Parallel Coordinates      //
/////////////////////////////////////////////
function initializeParallel(json, statistic){
    
    parallel.statistic = statistic;
    //debug

    debugData = json;
    //debugEnd
    //Start function
    parallel.x = "";
    parallel.y = "";
    parallel.line = "";
    parallel.axis = "";
    parallel.dimensions = "";
    parallel.minMax = {}; //container for max/min of each datapoint

    //console.log(json);
    // console.log(json)
    parallel.x = d3.scale.ordinal().rangePoints([0,width.parallel], .5);
    parallel.y = {}; // collection of y scales for each axis

    // Line scale and Axis function
    parallel.line = d3.svg.line();
    parallel.axis = d3.svg.axis().orient("left");
    parallel.path = function(datum){
        //console.log(datum);
        array = parallel.line(parallel.dimensions.map(function(indicator) {
            if (indicator!= "code" && indicator!="name" && indicator!="year"){
                //console.log(indicator, datum[indicator], parallel.y[indicator](datum[indicator]));
                // if(datum[indicator] == undefined){
                //     datum[indicator] = 0;
                // }
               
               return [parallel.x(indicator), parallel.y[indicator](datum[indicator])]; 
            } else {

            }
        }));
        //console.log(array);
        return array;
    }

    //turn text into buttons


    //Brush handling
    parallel.brush = function(d){
        try{
        var actives = parallel.dimensions
            .filter(function(p) {
             //   console.log(p);
                return !parallel.y[p]
                    .brush
                    .empty(); 
        }); 
        }
            catch(e){
                console.log(e.stack);
            }
        var extents = actives.map(function(p) { return parallel.y[p].brush.extent(); });

            parallel.foreground.style("visibility", function(d) {
                parallel.actives = actives;
                parallel.extents = extents;
                // d3.selectAll("[data-statecode="+d.code+"]").remove()
                return actives.every(function(p, i) {
                    return extents[i][0] <= d[p] && d[p] <= extents[i][1];
                }) ? "visible" : "hidden";
            });
            parallel.brush2();



            // map.states.style("display", function(d) {
            //     return d3.select("path.parallel[data-statecode="+d.properties.code+"]").style("display");
            // });

    }

    parallel.brush2 = function(){
        d3.selectAll('path.foreground[style*="visibility: hidden"]').each(function(fpath, i){
            if(fpath.code!=undefined && fpath.code.length > 0){
            d3.select("[data-statecode="+fpath.code+"]").style("opacity", 0.1);
             d3.selectAll("[line-statecode="+fpath.code+"]").classed("stateline", false);
         }

        });

        d3.selectAll('path.foreground[style*="visibility: visible"]').each(function(fpath, i){
            if(fpath.code!=undefined && fpath.code.length > 0){
            d3.select("[data-statecode="+fpath.code+"]").style("opacity", 1);
             d3.selectAll("[line-statecode="+fpath.code+"]").classed("stateline", true);
            }
    });
    }

    // Initialize SVG
    parallel.svg =  d3.select("div#svg-parallel").append("svg")
        .attr("width", width.parallel + margin.parallel.left + margin.parallel.right)
        .attr("height", height.parallel + margin.parallel.top + margin.parallel.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.parallel.left + "," + margin.parallel.top + ")");

    //create parallel.dimensions    
    parallel.dimensions = d3.keys(json[5]["states"][2]).filter(function(d){return d!="year" && d!="name" && d!="code"});
    
    //create Max/Min extents
    d3.map(parallel.dimensions).values().forEach(function(dimension){
        // if (dimension!= "code" && dimension!="name" && dimension!="year"){
            var valueCollection = [];
            if(!d3.select("#by_state").classed("activebutton")){
                json.forEach(function(yearObject){
                    yearObject["states"].forEach(function(state){
                    valueCollection.push(+state[dimension]);
                });
            });
            
            parallel.minMax[dimension] = d3.extent(valueCollection);
            } else {

            // neeeeeeewwwwww
                json[linegraph.value - 2001]["states"].forEach(function(state){ 
            //////////////////////json.forEach(function(year){
                // console.log(year);
                //////////////////year.states.forEach(function(state){
                    valueCollection.push(+state[dimension]);
                })
            }
            parallel.minMax[dimension] = d3.extent(valueCollection);
        // }
    console.log(d3.extent(valueCollection));
    })




    //parallel.dimensions is a filter containing every header in the JSON file except "City".
    //parallel.y is an array of linear scales, named for the json header it corresponds to.
    //every parallel.y scale's domain is the extent (min and max) of all values within the json under that scale's corresponding header.
    parallel.dimensions
        .forEach(function(dimension){
            if (dimension!= "code" && dimension!="name" && dimension!="year"){ 
                (parallel.y[dimension] = d3.scale.linear() // if dimension is City, return false. 
                    .domain(parallel.minMax[dimension])
                    .range([height.parallel,0])
                )
            }

            
            // return d != "City" && (parallel.y[d] = d3.scale.linear() // if d is City, return false. 
            //     .domain(d3.extent(json, function(p){ //Otherwise, create a linear scale & set it in parallel.y, and then return true.
            //         return +p[d];
            //     }))
            //     .range([height.parallel,0]))
        });

    // parallel.dimensions.forEach(function(indicator,i){
    //     var allValues = [];

    //     json[year]["states"].forEach(function(state){
    //             allValues.push(state[indicator]);
    //         })
    //     parallel.y[indicator].domain(d3.extent(allValues))
    // })

    parallel.x.domain(parallel.dimensions); //parallel.x's domain is the names of the headers of the json data.
    colorScale.domain(parallel.minMax[statistic])

    // Add grey background lines for context.
    parallel.background = parallel.svg.append("g")
        .attr("class", "parallel background group")
    .selectAll("path")
        .data(json[linegraph.value-2001]["states"])
    .enter().append("path")
        .attr("d", function(d,i){
            return parallel.path(d);
        })
        .attr("class", function(d,i){
            return "parallel background "+d.code;
        })
    .attr("transform", "translate(" + 30 + ",0)")

    // Add blue foreground lines for focus.
    parallel.foreground = parallel.svg.append("g")
        .attr("class", "parallel foreground group")
    .selectAll("path")
        .data(json[0]["states"])
    .enter().append("path")
        .attr("d", function(d,i){
            return parallel.path(d);
        })
        .attr("class", function(d,i){
            return "parallel foreground "+d.code;
        })
        .attr("data-statecode", function(d,i){
            return d.code;
        })
        .attr("transform", "translate(" + 30 + ",0)")
        .style("stroke", function(d,i){
            // console.log(".map.state."+d.code)
            var newColor = colorScale(d[statistic]);
            //console.log(newColor);
            d3.selectAll("path.map[data-statecode='"+d.code+"']")
                .style("fill", ""+newColor);
            d3.selectAll("path.allstateline[line-statecode='"+d.code+"']")
                .style("stroke", ""+newColor);
            return (colorScale(d[statistic]));
        })


    // Add a group element for each dimension.
    parallel.g = parallel.svg.selectAll(".dimension")
        .data(parallel.dimensions)
    .enter().append("g")
        .attr("class", "parallel dimension")
        .attr("transform", function(d) { return "translate(" + parallel.x(d) + ")"; });

    // Add an axis and title.
    parallelaxis = parallel.g.append("g")
        .attr("class", "parallel axis")
        .each(function(d) { d3.select(this).call(parallel.axis.scale(parallel.y[d]).ticks(6)); })
        .attr("transform", "translate(" + 30 + ",0)")
        .attr("id", function(d, i){
            if(i == 1)
                return "paxis"
        });
    
    parallelaxis.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -9)
        .text(function (d){
           return parallel.axistitle[d]
        })
        .attr("id", function(d, i){
            if(i == 3)
                return "paxistitle"
        });;
         // <button type = "button" class = "btn btn-success navbar-btn" id = "Crime">Crime</button>

    // console.log(parallel.minMax)
    // Add and store a brush for each axis.
    parallel.g.append("g")
        .attr("class", "parallel brush")
        .each(function(d) { 
            d3.select(this)
                .call(parallel.y[d].brush = d3.svg.brush().y(parallel.y[d])
                .on("brush", parallel.brush)
                .on("brushend", function(j){
                   // $("#"+j).click()
                   updatesmallline(j)
                    }));
         })
        .attr("transform", "translate(" + 30 + ",0)")
        .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);

    //Make parallel coordinate titles clickable
    d3.selectAll(".parallel.dimension g.parallel.axis text[text-anchor = 'middle']") //select all Parallel Coordinate axis labels
        .on("click", function(j){

            d3.selectAll(".parallel.dimension g.parallel.axis text[text-anchor = 'middle']").classed("active", false).style("fill", null)
            console.log(globalStat)
            d3.select(this).classed("active", true).style("fill", spectrums[j][5]);;
            //updateline(j);
            //updatesmallline(j);
            d3.select(".title").text("Unemployment Rates Across States")
            updateMapColors(j);
            d3.select(".yearsquare.active").style("background-color", spectrums[globalStat][5])
             d3.select(".yearsquare.active").style("background-color", spectrums[globalStat][5])
        })

    //Color Unemployment
    d3.select(".parallel.dimension g.parallel.axis text[text-anchor = 'middle']")  
        .classed("active", true)


}

function updateStatistic(j){
    
}
//////////////////////////////////////
//                                  //
// Function to update the parallels //
//                                  //
//////////////////////////////////////

function updateParallel(json, year){

    if(!year)
        year = 2001
var index = year - 2001;
    //console.log(json[index])
    //create Max/Min extents
statistic = parallel.statistic;
d3.map(parallel.dimensions).values().forEach(function(dimension){
        // if (dimension!= "code" && dimension!="name" && dimension!="year"){
            var valueCollection = [];
            if(!d3.select("#by_state").classed("activebutton")){
                json.forEach(function(yearObject){
                    yearObject["states"].forEach(function(state){
                    valueCollection.push(+state[dimension]);
                });
            });
            parallel.minMax[dimension] = d3.extent(valueCollection);
            parallel.dimensions
            .forEach(function(dimension){
                if (dimension!= "code" && dimension!="name" && dimension!="year"){ 
                    (parallel.y[dimension] // if dimension is City, return false. 
                        .domain(parallel.minMax[dimension])
                    );
                }
            });
            } else {

            // neeeeeeewwwwww
                json[linegraph.value - 2001]["states"].forEach(function(state){ 
            //////////////////////json.forEach(function(year){
                // console.log(year);
                //////////////////year.states.forEach(function(state){
                    valueCollection.push(+state[dimension]);
                });

                parallel.dimensions
                    .forEach(function(dimension){
                        if (dimension!= "code" && dimension!="name" && dimension!="year"){ 
                            (parallel.y[dimension] // if dimension is City, return false. 
                                .domain(parallel.minMax[dimension])
                            );
                        }
                    });
            parallel.minMax[dimension] = d3.extent(valueCollection);
            }
            console.log(d3.extent(valueCollection));
            //});
        // }
    });






// console.log(parallel.minMax[statistic])
// colorScale.domain(parallel.minMax[statistic])

// console.log(json[index])
//linegraph.svg.selectAll(".stateline")



parallel.background
        .data(json[linegraph.value-2001]["states"])
    .transition()
    // .duration(500)
    .attr("d", function(d,i){
           return parallel.path(d);
       });

parallel.foreground
.data(json[linegraph.value-2001]["states"])
.transition()
// .duration(500)
.attr("d", function(d,i){
       //console.log(d)
       return parallel.path(d);
   });

if(d3.select("#by_state").classed("activebutton")){
parallelaxis
    .transition()
    // .duration(500)
    .each(function(d) { d3.select(this).call(parallel.axis.scale(parallel.y[d])); });
}else {

}


//
//    console.log(parallel.background.selectAll("path"))
// // Add grey background lines for context.
//   // parallel.background = parallel.svg.append("g")
//     //.attr("class", "parallel background group")
//     parallel.background
//        .selectAll("path")
//        .data(json[index]["states"])
//        .attr("d", function(d,i){
//            console.log(d)
//            return parallel.path(d);
//        })
//        .attr("class", function(d,i){
//            return "parallel background "+d.code;
//        })
//    .attr("transform", "translate(" + 30 + ",0)")
//
//    // Add blue foreground lines for focus.
//    parallel.foreground = parallel.svg.append("g")
//        .attr("class", "parallel foreground group")
//    .selectAll("path")
//        .data(json[0]["states"])
//    .enter().append("path")
//        .attr("d", function(d,i){
//            return parallel.path(d);
//        })
//        .attr("class", function(d,i){
//            return "parallel foreground "+d.code;
//        })
//        .attr("data-statecode", function(d,i){
//            return d.code;
//        })
//        .attr("transform", "translate(" + 30 + ",0)")
//        .style("stroke", function(d,i){
//            // console.log(".map.state."+d.code)
//            d3.selectAll("path.map[data-statecode='"+d.code+"']")
//                .style("fill", ""+colorScale(d[statistic]));;
//            return (colorScale(d[statistic]));
//        })
//

}


