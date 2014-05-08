////////////////////////////////////
// Initialize data change buttons //
////////////////////////////////////

function initializeButtons(){
    d3.select('#Unemployment').on('click', unemployment)
    d3.select('#HomeownerRates').on('click', homeowner)
    d3.select('#busBankr').on('click', bankruptcy)
    d3.select('#burg_rate').on('click', crime)
    d3.select('#GSP').on('click', grossproduct)
}
function unemployment(){ 
	updateline("unemp");
	updatesmallline("uemp")
	d3.select(".title").text("Unemployment Rates Across States")
	updateMapColors("Unemployment");
}
function homeowner(){ 
	updateline("home");
	updatesmallline("home")
	updatesmallline("home")
	d3.select(".title").text("Homeowner Rates Across States")
	updateMapColors("HomeownerRates");
}
function bankruptcy(){ 
	updateline("busBankr");
	updatesmallline("busBankr")
	d3.select(".title").text("Business Bankruptcy Rates Across States")
	updateMapColors("busBankr");
}
function crime(){ 
	updateline("crime");
	updatesmallline("crime")
	d3.select(".title").text("Crime Rates Across States")
	updateMapColors("burg_rate");
}
function grossproduct(){ 
	updateline("gsp");
	updatesmallline("gsp")
	d3.select(".title").text("Gross State Product")
	updateMapColors("GSP");
}
function activateModeButton(){
	var targetButton = d3.select(event.target);
		if(targetButton.classed("activebutton")){
			targetButton.classed("activebutton", false);
		} 
		else{
			targetButton.classed("activebutton", true);
		}
	updateParallel(debugData, linegraph.value);
   updateMapColors();
   updateStateinfo(true)
}

function play(){
	var yearsToPlay = ["2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011"];

	console.log(yearsToPlay);
  var index = 0;

  function nextTab() {
	$(".yearsquare.y"+yearsToPlay[index]+"").click();
    index = (index + 1);
  }
  if(index < yearsToPlay.length)  nextTab();

  window.setInterval(nextTab, 200);

};

