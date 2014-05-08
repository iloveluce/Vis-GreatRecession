function initializeEvents(eventsData){


	var eventsBar = d3.select("#eventsBar");
	d3.select("#eventsBar")
	eventsBar.classed("hidden", true);

	events = eventsBar
		.selectAll(".event")
		.data(eventsData)
		.attr("width", width.events)
		.attr("height", height.events)
		.attr("margin-top", margin.events.top)
		.attr("margin-right", margin.events.right)
		.attr("margin-bottom", margin.events.bottom)
		.attr("margin-left", margin.events.left)


events
	.enter()
		.append("div")
		.classed("eventItem", true)
		.html(function(d){
			if (d.Title && d.Title.length>0) {
			return "\
			<div>\
				<h4><strong>"+d.Year + "</strong>: " + d.Title+"</h4>	\
				<p>"+d.Description+". <a  target='newwindow' href='"+d.Source+"'>"+d.DescriptionSource+".</a></p>\
			</div>\
		"}
	});

$('#eventsBarChangeIndicatorDropdown').change(eventsBarChangeIndicator);

}

function eventsBarChangeIndicator(){
	console.log("eventsBarChangeIndicatorDropdown triggered");
	var value = $('#eventsBarChangeIndicatorDropdown').val();
    d3.selectAll(".parallel.dimension g.parallel.axis text[text-anchor = 'middle']")
    	.classed("active", false)
    	.each(function(){
    		if(d3.select(this).datum() == value) d3.select(this).classed("active", true);
    	})
    //updateline(j);
    //updatesmallline(j);
    updateMapColors(value);
 	$('#eventsBarChangeIndicatorDropdown').blur();

}