//////////////////////////////
//		year selector 		//
//////////////////////////////

function initializeYearSelector(json, json2){
	yearselector.year = 2001;
	var yearDrag = d3.behavior.drag()
		.on("dragstart", dragHandler)
		.on("drag", dragHandler)
		.on("dragend", dragHandler);

	d3.selectAll(".yearsquare")
		.on("click", changeYear)
		.call(yearDrag);

	function changeYear(d){
	  	linegraph.value = +d3.select(this).text();
	  	yearselector.year = +d3.select(this).text();
	  	d3.selectAll(".yearsquare")
	  		.classed("active", false).attr("id", "colorNo").style("background-color", "#2c3e50") //.style("box-shadow", "none");
	  	d3.select(this)
	  		.classed("active", true).attr("id", "colorYes").style("background-color", spectrums[globalStat][5]) //.style("box-shadow", "0px 7px 0px yellow");

	  	//console.log(d3.select(d))

		updateParallel(json2, linegraph.value);
		updateMapColors();
		updateStateinfo(true)


	}

	function dragHandler(d){
		//console.log(event);
		if(event.type=="mousedown"){yearselector.origin = {x : event.x, y: event.y}};
		var element = document.elementFromPoint(event.x, yearselector.origin.y);
		if(d3.select(element).classed("yearsquare")==true){
			element.click()
		}
	}
}

