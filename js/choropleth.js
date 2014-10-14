/////////////////////////////////////////////
//              Define function to         //
//              draw Choropleth map        //
/////////////////////////////////////////////

function initializeMap(json, statistic){
    map.zoomed = false;
    map.statistic = statistic;
    map.oldstatelines = {};
    map.centered = null;
    map.projection = d3.geo.albersUsa()
        .scale(($(window).width()*5)/10)
        .translate([width.map/2, height.map/2]);

    map.svg = d3.select("div#svg-map").append("svg")
        .attr("width", width.map + margin.map.left + margin.map.right)
        .attr("height", height.map + margin.map.top + margin.map.bottom)
        .attr("shape-rendering", "geometricPrecision")
    .append("g")
        .attr("transform", "translate(" + margin.map.left + "," + margin.map.top + ")")


    map.svg.append("rect")
        .attr("class", "backgroundmap")
        .attr("width", width.map)
        .attr("height", height.map)
        //.on("click", zoom)


    //=console.log(monarchToLuciano[statistic])

    map.svg.append("text")
        .attr("class", "toptext")
        .attr("x", (width.map / 2))
        .attr("y", 0 - (margin.map.top / 4) + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text(longgraphtitlest[monarchToLuciano[statistic]]);



    map.path = d3.geo.path()
        .projection(map.projection);

    //declare domain for color Scale

    map.states = map.svg.selectAll("path")
        .data(topojson.feature(json, json.objects.states).features)
    .enter().append("path")
        .attr("d", map.path)
        .attr("class", function(d){
            return "map state " + d.properties.code;
        })
        .attr("data-statecode", function(d,i){
            return d.properties.code;
        })
        .attr("id", function(d){
            if(d.properties.code == "LA"){
                tourla = d;
                return "tourstate"
            }

        })
        .on("click", zoom)


////////
///// start new changes



        for (var i=0; i<colorRange.length; i++) {
        map.svg.append("rect").attr({
            x:(width.map-25),
            width:20,
            y:(height.map-150) + 25*i,
            height:25,
            "fill": function(i) {return colorRange[i]},
            "id": "color" + i
        })
        .style("fill", function() { return colorRange[i]}).attr("class" , "colorscale")
        }

        // getting the values of buckets
        /// for legend
        // getting the values of buckets
        var min = 2.5;
        var max = 6.58;
        var key = (max - min) / (colorRange.length+1)
        var legendKeys = [min+key, min+2*key, min+3*key, min+4*key, min+5*key, min+6*key]
        //console.log(legendKeys)

        for (var i=0; i<colorRange.length; i++) {
            map.svg.append("text").attr({
                "id": "bucket" + i,
                "transform":"translate(" + (width.map-30) + "," + ((height.map-130) + 25*i) + ")",
                "text-anchor":"end"
        })

            legendKeys[i] = Math.round(legendKeys[i]*100)/100
            if (i == 0) {
                d3.select("#bucket" +  i + "").attr("class" , "colorscale").text("< " + legendKeys[i])
            }
            else if (i < 5) {
                var temp = Math.round(((legendKeys[i-1])+.01)*100)/100
                d3.select("#bucket" + i + "").attr("class" , "colorscale").text(temp + " - " + "" + legendKeys[i] + "")
            }
            else {
                d3.select("#bucket" + i + "").attr("class" , "colorscale").text("> " + legendKeys[i])
            }

        }

        map.svg.append("text").text("").attr({
            "id": "legend_title",
            "transform":"translate(" + (width.map) + "," + (height.map-180) + ")",
            "text-anchor":"end"
        }).attr("class" , "colorscale")

        map.svg.append("text").style("font-weight", "bolder").text(statistic + " Rate(%)").attr({
            "id": "legend_info",
            "transform":"translate(" + (width.map) + "," + (height.map-160) + ")",
            "text-anchor":"end"
        }).attr("class" , "colorscale")



        //console.log(colorRange)
        //console.log(statistic)

        runAQueryOn("texas");


/////// end legend changes



   //     map.svg.append("path")
   //   .datum(topojson.mesh(json, json.objects.states, function(a, b) { return a !== b; }))
   //   .attr("id", "state-borders")
   //   .attr("d", map.path);
}

function updateMapColors(statistic){

    // update color scheme
    if (statistic !== undefined) {
        globalStat = statistic;
        rainbow.setSpectrum(spectrums[statistic][0], spectrums[statistic][1], spectrums[statistic][2], spectrums[statistic][3], spectrums[statistic][4], spectrums[statistic][5]);
        colorRange = [];
        for(i=0; i<rainbow.length; i++){
            colorRange.push(rainbow.colorAt(i+1));
        }
        //d3.select("#yearsquare:active").style("backround-color", spectrums[statistic][5])
         //.style.backround-color=(spectrums[globalStat][5]);
    }

// [].forEach(function(d,i){
//     colorRange[i] = "remove";
// })
// for (var i = colorRange.length-1; i >= 0; i--) {
//     if (colorRange[i].value === "remove") {
//         colorRange.splice(i, 1);
//     }
// }
var colorScale = d3.scale.quantize()
    .range(colorRange);

    // // for when we want to update but not change statistic
    if(statistic)
        map.statistic = statistic;
    else
        statistic = map.statistic;

    colorScale.domain(parallel.minMax[statistic]);

        parallel.foreground
            .style("stroke", function(d,i){

            var newColor = colorScale(d[statistic]);
            //console.log(d3.selectAll("path.map[data-statecode='"+d.code+"']"));
            d3.selectAll("path.map[data-statecode='"+d.code+"']")
               .style("fill", ""+newColor);


            // d3.selectAll("path.map[data-statecode='"+d.code+"']").style("display", "none")
            // if( d3.selectAll("path.map[data-statecode='"+d.code+"']")[0][0]){
            // 	$("path.map[data-statecode='"+d.code+"']")[0][0].offsetHeight
            // }
            // d3.selectAll("path.map[data-statecode='"+d.code+"']").style("display", "")
							   // d3.selectAll("path.map[data-statecode='"+d.code+"']").get(0).offsetHeight;
							   // d3.selectAll("path.map[data-statecode='"+d.code+"']").show();


// 							   sel.style.display='none';
// sel.offsetHeight; // no need to store this anywhere, the reference is enough
// sel.style.display='';
            d3.selectAll("path.allstateline[line-statecode='"+d.code+"']")
                .style("stroke", ""+newColor);
            return newColor;
        });

    map.svg.select(".toptext").text(longgraphtitlest[monarchToLuciano[statistic]]);

     map.svg.select(".bottomtext").text(longgraphtitleen[monarchToLuciano[statistic]]);


    /// for legend
    // getting the values of buckets
    var min = parallel.minMax[statistic][0];
    var max = parallel.minMax[statistic][1];
    var key = (max - min) / (colorRange.length+1)
    var legendKeys = [min+key, min+2*key, min+3*key, min+4*key, min+5*key, min+6*key]
    // console.log(legendKeys)

    for (var i=0; i<colorRange.length; i++) {

                d3.select("#color" +  i + "").style("fill", function() { return colorRange[i]})

        if (statistic == "GSP") {
            legendKeys[i] = Math.round(legendKeys[i]);
            if (i == 0) {
                d3.select("#bucket" +  i + "").text("< " + numberWithCommas(legendKeys[i]))
            }
            else if (i < 5) {
                var temp = numberWithCommas(legendKeys[i-1]+1)
                d3.select("#bucket" + i + "").text(temp + " - " + "" + numberWithCommas(legendKeys[i]) + "")
            }
            else {
                d3.select("#bucket" + i + "").text("> " + numberWithCommas(legendKeys[i]))
            }
        }

        else {
            legendKeys[i] = Math.round(legendKeys[i]*100)/100
            if (i == 0) {
                d3.select("#bucket" +  i + "").text("< " + legendKeys[i])
            }
            else if (i < 5) {
                var temp = Math.round(((legendKeys[i-1])+.01)*100)/100
                d3.select("#bucket" + i + "").text(temp + " - " + "" + legendKeys[i] + "")
            }
            else {
                d3.select("#bucket" + i + "").text("> " + legendKeys[i])
            }
        }
    }

    // console.log(longgraphtitlest[monarchToLuciano[statistic]])

    if (statistic == "Unemployment") {
        d3.select("#legend_title").text("");
        d3.select("#legend_info").text(longgraphtitlest[monarchToLuciano[statistic]]).style("font-weight", "bolder");
    }
    else {
        d3.select("#legend_title").text(longgraphtitlest[monarchToLuciano[statistic]]).style("font-weight", "bolder");
        d3.select("#legend_info").text("(" + longgraphtitleen[monarchToLuciano[statistic]] + ")").style("font-weight", "boldest");
    }

    console.log($(".state").css("fill"))
    $(".state").hide().show(0)
    console.log($(".state").css("fill"))

    //svg.select("#legendMin").text(d3.min(parallel.minMax[statistic]));
    //svg.select("#legendMax").text(d3.max(parallel.minMax[statistic]));
    /// for legend end




    // json = [];
    // d3.selectAll(".map.state").each(function(d){
    //     json.push(d);
    // })

    // var min = d3.min(json, function(data) { return d3.min(data[statistic], function(d){
    // return parseInt(d);})});

    // var max = d3.max(json, function(data) { return d3.max(data[statistic], function(d){

    // if(statistic == "home")
    //     console.log(parseFloat(d))
    // return parseFloat(d);})});

    // console.log(json);
    // console.log(min)
    // console.log(max)

    // linegraph.y.domain([min, max]);

    // linegraph.svg.select(".yaxis")
    //         .transition()
    //         .duration(1000)
    //         .call(linegraph.yAxis);

    // linegraph.svg.selectAll(".stateline")
    //     .transition()
    //     .duration(1000)
    //     .attr("d", function(d){return linegraph.line(d[statistic])})

    // linegraph.svg.select(".titlegraph")
    //         .transition()
    //         .text(statistic);
}



function zoom(d) {
  var x, y, k;



  // do not allow selection of states not brushed *fixes bug*
  if(!d3.select("[line-statecode="+d.properties.code+"]")[0][0].classList.contains("stateline")){
   if(map.zoomed){
    var getout = true;
    map.oldstatelines[0].forEach(function(datu){
        if( datu["__data__"]["code"] == d.properties.code)
            getout = false

    })
    if(getout)
        return
   }
    else
        return
    }


  if (d && map.centered !== d) {

        //query NYTimes API
    runAQueryOn(d.properties.name);

    d3.selectAll("[line-statecode="+d.properties.code+"]").classed("selectedline", false)
    d3.selectAll("[data-statecode=" +d.properties.code+"]").classed("selectedline", false)
   d3.selectAll("[line-statecode="+d.properties.code+"]").style("stroke-width", "5px")

    // for whem we zoom out, we can bring them back
    if(map.zoomed == false){
        map.oldstatelines =  d3.selectAll(".stateline")


    }

    map.oldstatelines.classed("stateline", function(s) {
            if(s.code == d.properties.code || s.code == "US" ){
                return true;
            }
            else
                return false;
        });

    var centroid = map.path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    map.centered = d;

    d3.select("#eventsBar").classed("hidden", false);
     d3.select("#eventsBartitle").classed("hidden", false);
    d3.select("#svg-parallel").classed("hidden", true);

    d3.selectAll(".colorscale").classed("hidden", true);

    updatesmallline()
    updateStateinfo(true, d)
    map.zoomed = true;
  } else {

    updateStateinfo(false)
    map.oldstatelines.classed("stateline", true)

    x = width.map / 2;
    y = height.map / 2;
    k = 1;
    map.centered = null;
    d3.selectAll(".stateline").style("stroke-width", null);

    d3.select("#eventsBar").classed("hidden", true);
    d3.select("#eventsBartitle").classed("hidden", true);
    d3.select("#svg-parallel").classed("hidden", false);

    setTimeout(function() { d3.selectAll(".colorscale").classed("hidden", false); },500)

    map.oldstatelines = {};
    map.zoomed = false;
  }

  map.svg.selectAll("path")
      .classed("active", map.centered && function(d) { return d === map.centered; });

  map.svg.transition()
        .delay(0)
      .duration(750)
      .attr("transform", "translate(" + width.map / 2 + "," + height.map / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");

    updatesmallline()
}