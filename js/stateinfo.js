function initializeStateinfo(stateflag){


	stateinfo = d3.select("#stateinfo");
	stateinfo.style("height", $(window).height()/2)
	stateinfo.classed("hidden", true);

	//stateinfo.attr("class", "stateinfo")
		//.attr("width", width.events)
	//.attr("height", height.events)
	//	.attr("margin-top", margin.events.top)
	//	.attr("margin-right", margin.events.right)
	//	.attr("margin-bottom", margin.events.bottom)
	//	.attr("margin-left", margin.events.left)


	stateinfo.select("#insideinfo").append("h1")
		.attr("class", "statetitle")
        //.attr("x", (width.smalllinegraph ))
        //.attr("y", 0 - (margin.smalllinegraph.top / 2) - 10)
        .style("text-align", "center")

    stateinfo.select("#insideinfo").append("h4")
    .style("text-align", "center")
		//.attr("class", "statetitle")
    //stateinfo.select("#insideinfo").append("br")
    stateinfo.select("#insideinfo").append("img")
    	.attr("class", "stateflag")
    	//.attr("width", 168)
		//.attr("height", 95)


    stateinfo.select("#insideinfo").append("p")

    stateinfo.year=  2001
    stateinfo.flags = stateflag;
     d3.select('#zoom').on('click', function(){
     	zoom(stateinfo.data)
     })
}

function updateStateinfo(state, data){

	if(!state){
		stateinfo.classed("hidden", true)
		return;
	}



	if(data){
	stateinfo.classed("hidden", false)
		if(stateinfo.data != data){
		stateinfo.data = data
		}
	}
	else if(stateinfo.year !=  yearselector.year){
		stateinfo.year =  yearselector.year
	}


	// We are currently not showing a state
	if(!stateinfo.data.properties)
		return

	stateinfo.select(".statetitle")
        .text(stateinfo.data.properties.name)
        //.style("text-align", "center")

    stateinfo.select("h4")
        //.append("h4")
        .text(stateinfo.year)
       // .style("text-align", "center")
        //.html("<h2>"+stateinfo.data.properties.name + "</h2>" + "<h4>in " + stateinfo.year + "</h4>")

    stateinfo.select("img")
    		.attr("src", function(){
    			 var sauce;
    			 stateinfo.flags.forEach(function(d){
    				if(stateinfo.data.properties.code == d.Abbreviation){
    					sauce = d.web

    				}

    			})
    			 return sauce
    		})




   	index = stateinfo.year - 2001;
   	//console.log(d3.select(".line."+stateinfo.properties.code)[0][0]["__data__"]["pop"][index])
   	stateinfo.select("p").html("Population:&nbsp;&nbsp;" + numberWithCommas(d3.select(".line."+stateinfo.data.properties.code)[0][0]["__data__"]["pop"][index]) + "<br>"+
   		"Home Vacancy Rate:&nbsp;&nbsp;" +  d3.select(".line."+stateinfo.data.properties.code)[0][0]["__data__"]["home"][index]+ "<br>"+
   		"Real Gross State Product:&nbsp;&nbsp;" +  numberWithCommas(Math.round(d3.select(".line."+stateinfo.data.properties.code)[0][0]["__data__"]["gsp"][index]))+ "<br>"+
   		"Burglary Rate:&nbsp;&nbsp;" +  d3.select(".line."+stateinfo.data.properties.code)[0][0]["__data__"]["crime"][index] + "<br>"+
   		"Business Bankruptcy Rate:&nbsp;&nbsp;" +  d3.select(".line."+stateinfo.data.properties.code)[0][0]["__data__"]["busBankr"][index]
   		)//.style("font-size", "20px")


	//console.log(d3.select(".line."+data.properties.code)[0][0]["__data__"]["pop"][0] )


}


//  events
//  	.enter()
//  		.append("div")
//  		.classed("eventItem", true)
//  		.html(function(d){
//  			if (d.Title && d.Title.length>0) {
//  			return "\
//  			<div>\
//  				<h4><strong>"+d.Year + "</strong>: " + d.Title+"</h4>	\
//  				<p>"+d.Description+". <a  target='newwindow' href='"+d.Source+"'>"+d.DescriptionSource+".</a></p>\
//  			</div>\
//  		"}
//  	});
//
//  $('#eventsBarChangeIndicatorDropdown').change(eventsBarChangeIndicator);
//
//  }
