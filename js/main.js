
/////////////////////////////////////////////
//           Declare variables             //
/////////////////////////////////////////////
//event controller
var eventController = {};

// prep an object for the NYtimes API
var stateIdName = {}

//stateData variable
stateData = {};

//dragging 
var yearselector = {};

var stateinfo = {};

// Margin convention variables
var margin;
var width;
var height;

// SVG reference object
var svg = {};

// Map supervariable
var map = {};

//Parallel Coordinates supervariable
var parallel = {};

//Tooltip supervariable
var tooltip;

//Data test/debug variable
var debugData = {},
    debugYear = 5,
    debugDimension = "HomeownerRates";
//for tour
var tourla ={};

//line graph super variable
var linegraph = {};
linegraph.value = 2001;

// small line graph super variable
var smalllinegraph = {};

// prep an object for the NYtimes API
var articleObject = {};

// global vars for color change
var globalStat = "Unemployment"
// titles first and second line
var longgraphtitlest = {"unemp": "Unemployment Rate (%)", "busBankr": "Business Bankruptcy Rate", "crime": "Burglary Rate",
"gsp": "Real Gross State Product", "home": "Home Vacancy Rate"}
var longgraphtitleen = {"unemp": "", "busBankr": "per 100,000 People", "crime": "per 100,000 People",
"gsp": "per Capita", "home": "per 100 Houses"}

var monarchToLuciano = {"Unemployment": "unemp", "busBankr": "busBankr", "burg_rate": "crime",
"GSP": "gsp", "HomeownerRates": "home"}

var spectrums = {"Unemployment": ["#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#f03b20", "#bd0026"], 
"busBankr": ["#ffffd4", "#fee391", "#fec44f", "#fe9929", "#d95f0e", "#993404"], 
"burg_rate": ["#ffffcc", "#d9f0a3", "#addd8e", "#78c679", "#31a354", "#006837"],
"GSP": ["#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#c51b8a", "#7a0177"], 
"HomeownerRates": ["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#2c7fb8", "#253494"]}

//evets
var events = {};
//color scale

var rainbow = new Rainbow();
rainbow.length = 6;
rainbow.setSpectrum(spectrums["Unemployment"][0], spectrums["Unemployment"][1], spectrums["Unemployment"][2], spectrums["Unemployment"][3], spectrums["Unemployment"][4], spectrums["Unemployment"][5]);
rainbow.setNumberRange(0, rainbow.length); 
var colorRange = [];
// rainbow.colourAt(number); // based on the numbers from your array, this would return the color you want
for(i=0; i<rainbow.length; i++){
    colorRange.push(rainbow.colorAt(i+1));
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
    // .range(["#000000","#222222", "#444444", "#666666", "#888888", "#AAAAAA", "#BBBBBB", "#CCCCCC", "#DDDDDD", "#EEEEEE", "#FFFFFF"]);

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

        //debug events
        function debugEventData(){
            var eventItemObject = {
                title: "New York",
                description: "This is the description",
                linkURL: "http://www.google.com/",
                linktext: "Google.com"
            }
            var metaDataObject = {
                states: ["NY"],
                years: ["2001", "2003", "2007", "2011"],
                indicators: ["GSP", "burg_rate"],
            }; d3.select("#eventsBar").custom_eventsBar_addEventItem(eventItemObject, metaDataObject);

            var eventItemObject = {
                title: "USA",
                description: "This is the description",
                linkURL: "http://www.google.com/",
                linktext: "Google.com"
            }
            var metaDataObject = {
                states: ["USA"],
                years: ["2001", "2003", "2007", "2011"],
                indicators: ["GSP", "burg_rate"],
            }; d3.select("#eventsBar").custom_eventsBar_addEventItem(eventItemObject, metaDataObject);

            var eventItemObject = {
                title: "New Jersey",
                description: "This is the description",
                linkURL: "http://www.google.com/",
                linktext: "Google.com"
            }
            var metaDataObject = {
                states: ["NJ"],
                years: ["2001", "2003", "2007", "2011"],
                indicators: ["GSP", "burg_rate"],
            }; d3.select("#eventsBar").custom_eventsBar_addEventItem(eventItemObject, metaDataObject);
        }

/////////////////////////////////////////////
//          Application startpoint         //
/////////////////////////////////////////////


addLoading();
queue()
    .defer(d3.json, "./Vis-GreatRecession/data/us-named.json")
    .defer(d3.json, "./Vis-GreatRecession/data/MonarchStyle5.json")
    .defer(d3.json, "./Vis-GreatRecession/data/LucianoPlusID.json")
    .defer(d3.csv, "./Vis-GreatRecession/data/eventsData.csv")
    .defer(d3.csv, "./Vis-GreatRecession/data/stateFlagMe.csv")
    // .defer(d3.csv, "../data/d3.csv")
    .await(main);
clearLoading();

function main(error, usNamedJson, stateDataJson, complete, eventsData, stateflag){
    try{
        //// statesToStates array
        // if (stateIdName[statesToStates.state_id] == undefined) {
        //     stateIdName[statesToStates.state_id] = statesToStates.state_name;
        // }
        //define moveToFront
        d3.selection.prototype.moveToFront = function() {
          return this.each(function(){
            this.parentNode.appendChild(this);
          });
        };

        d3.selection.prototype.custom_eventItem_hide = function(){
            return this.each(function(){
                d3.select(this)
                    .transition()
                    .style("height", "0px")
            })
        }

        d3.selection.prototype.custom_eventItem_show = function(){
            return this.each(function(){
                d3.select(this)
                    .transition()
                    .style("height", "100px")
            })
        }

        /*
            //Parameter objects convention:
            var eventItemObject = {
                title: "This is the title",
                description: "This is the description",
                linkURL: "http://www.google.com/",
                linktext: "Google.com"
            }
            var metaDataObject = {
                states: ["US", "NY", "CT", "NV", "AZ", "FL", "NJ", "AK"],
                years: ["2001", "2003", "2007", "2011"],
                indicators: ["GSP", "burg_rate"],
            }



        */




        //DEBUG STUFF

        /*
            d3.selection.prototype.custom_eventsBar_addEventItem = function(eventItemObject, metaDataObject)
            d3.selection.prototype.custom_eventsBar_hideEventItems = function(metaDataObject);
            d3.selection.prototype.custom_eventsBar_showEventItems = function(metaDataObject);
            d3.selection.prototype.custom_eventsBar_clearEventItems = function();

        */

        eventController = {
            addItem : function(metaDataObject, eventItemObject) {
                d3.select("#eventsBar").custom_eventsBar_addEventItem(metaDataObject, eventItemObject);
            },
            hideItems : function(metaDataObject){
                d3.select("#eventsBar").custom_eventsBar_hideEventItems(metaDataObject);
            },
            showItems : function(metaDataObject){
                d3.select("#eventsBar").custom_eventsBar_hideEventItems(metaDataObject);  
            },
            clearItems : function(){
                d3.select("#eventsBar").custom_eventsBar_clearEventItems();
            }
        }

        d3.selection.prototype.custom_eventsBar_addEventItem = function(metaDataObject, eventItemObject){
            return this.each(function(){
                //append a new div
                var newDiv = d3.select(this)
                    .append("div")
                    .classed("eventItem", true);

                //add year
                newDiv.append("h2")
                    .text(metaDataObject.years[0])
                //add header
                newDiv.append("h4")
                    .text(eventItemObject.title);

                //add paragraph and link to original article
                var htmlString = eventItemObject.description + " <a href='"+eventItemObject.linkURL+"'>"+eventItemObject.linktext+"</a>";
                newDiv.append("p")
                    .html(htmlString);

                //add metadata to the node
                newDiv.node()["data-eventItem-states"] = metaDataObject.states;
                newDiv.node()["data-eventItem-years"] = metaDataObject.years;
                newDiv.node()["data-eventItem-indicators"] = metaDataObject.indicators;
            })
        }
        d3.selection.prototype.custom_eventsBar_hideEventItems = function(metaDataObject){
            return this.each(function(){
                if(metaDataObject == null){
                //if no parameters are passed, hide all
                d3.select(this)
                    .selectAll(".eventItem")
                    .transition()
                    .style("height", "0px");
                } else {
                //if parameters are passed
                // console.log(this);
                d3.select(this)
                    //select all .eventItems and filter 
                    .selectAll(".eventItem")
                    .filter(function(d,i){
                        var thisEvent = this;
                        var flags = {}; //flags for our three filter categories
                        flags.states = {boolState: false, objectKey: "states"};
                        flags.years = {boolState: false, objectKey: "years"};
                        flags.indicators = {boolState: false, objectKey: "indicators"};

                        //iterate over each flag and hide the eventItem if the eventItem matches
                        [flags.states, 
                         flags.years, 
                         flags.indicators]
                        .forEach(function(flag){
                            //if the flag is already true, or if the filter array wasn't provided in the object, skip this flag
                            if(flag.boolState == true || !metaDataObject[flag.objectKey])return;
                            //if a match is found, set the flag to true
                            metaDataObject[flag.objectKey].forEach(function(filterItem){
                                if(thisEvent["data-eventItem-"+flag.objectKey]
                                    && ((thisEvent["data-eventItem-"+flag.objectKey].indexOf(filterItem))>=0)){
                                    flag.boolState = true;
                                }
                            })
                            //if the flag is true, hide the item
                            if(flag.boolState == true){
                                d3.select(thisEvent)
                                    .transition()
                                    .style("height", "0px");
                                return;
                            }
                        });
                    })
                }
            })
        }
        d3.selection.prototype.custom_eventsBar_showEventItems = function(metaDataObject){
            return this.each(function(){
                if(metaDataObject == null){
                //if no parameters are passed, hide all
                d3.select(this)
                    .selectAll(".eventItem")
                    .transition()
                    .style("height", "100px");
                } else {
                //if parameters are passed
                // console.log(this);
                d3.select(this)
                    //select all .eventItems and filter 
                    .selectAll(".eventItem")
                    .filter(function(d,i){
                        var thisEvent = this;
                        var flags = {}; //flags for our three filter categories
                        flags.states = {boolState: false, objectKey: "states"};
                        flags.years = {boolState: false, objectKey: "years"};
                        flags.indicators = {boolState: false, objectKey: "indicators"};

                        //iterate over each flag and hide the eventItem if the eventItem matches
                        [flags.states, 
                         flags.years, 
                         flags.indicators]
                        .forEach(function(flag){
                            //if the flag is already true, or if the filter array wasn't provided in the object, skip this flag
                            if(flag.boolState == true || !metaDataObject[flag.objectKey])return;
                            //if a match is found, set the flag to true
                            metaDataObject[flag.objectKey].forEach(function(filterItem){
                                if(thisEvent["data-eventItem-"+flag.objectKey]
                                    && ((thisEvent["data-eventItem-"+flag.objectKey].indexOf(filterItem))>=0)){
                                    flag.boolState = true;
                                }
                            })
                            //if the flag is true, hide the item
                            if(flag.boolState == true){
                                d3.select(thisEvent)
                                    .transition()
                                    .style("height", "100px");
                                return;
                            }
                        });
                    })
                }
            })
        }

        d3.selection.prototype.custom_eventsBar_clearEventItems = function(){
            return this.each(function(){
                d3.select(this)
                    .selectAll(".eventItem")
                    .remove();
            })
        }
        //FIXME: fix in data
        //Removes DC from stateData
        stateDataJson.forEach(function(yearData,i){
            yearData.states.forEach(function(state, j){
                if(state.code=="DC"){
                    yearData.states.splice(j--, 1)
                }
            })
        });
        complete.forEach(function(state, i){
            if(state.code=="DC"){
                complete.splice(i--, 1)
            }
        });
        stateData = stateDataJson;
        declareMargins();
        initializeMap(usNamedJson, "Unemployment");
        initializeParallel(stateDataJson, "Unemployment");
        initializeline(complete, "unemp",stateDataJson );
        initializesmallline(complete);
        initializeTooltip(stateDataJson);
        initializeButtons();
        initializeEvents(eventsData);
        initializeStateinfo(stateflag);
        initializeYearSelector(complete, stateDataJson);
         // Start the tour!
        hopscotch.startTour(tour);
    }catch(e){
        console.log(e.stack);
    }  
}



/////////////////////////////////////////////
//              Declare margins &          //
//              initialize SVGs            //
/////////////////////////////////////////////

function declareMargins(){
    margin = {
        map: { top: 20, right: 0,  bottom: 20, left: 10 },
        parallel: { top: 40, right: 35, bottom: 10, left: 15},
        linegraph: { top: 20, right: 20,  bottom: 50, left: 115 },
        smalllinegraph: { top: 50, right: 5,  bottom: 35, left: 50 },
        tooltip: { top: 5, right: 5,  bottom: 5, left: 5 },
        events: { top: 5, right: 5,  bottom: 5, left: 5 },
        stateinfo: { top: 5, right: 5,  bottom: 5, left: 5 }
    };

    width = {
        map: $(window).width()/2 - margin.map.left - margin.map.right,
        parallel: $(window).width()/2 - margin.parallel.left - margin.parallel.right,
        linegraph: 1095 - margin.linegraph.left - margin.linegraph.right,
        smalllinegraph: 310 - margin.smalllinegraph.left - margin.smalllinegraph.right,
        tooltip: 100 - margin.tooltip.left - margin.tooltip.right,
        events: 300 - margin.tooltip.left - margin.tooltip.right,
        stateinfo: 300 - margin.stateinfo.left - margin.stateinfo.right
    };

    height = {
        map: $(window).height()/2 - margin.map.top - margin.map.bottom,
        parallel: $(window).height()/2 - margin.parallel.top - margin.parallel.bottom,
        linegraph: 400 - margin.linegraph.top - margin.linegraph.bottom,
        smalllinegraph: 240 - margin.smalllinegraph.top - margin.smalllinegraph.bottom,
        tooltip: 100 - margin.tooltip.top - margin.parallel.top,
        events: $(window).height()/2,
        stateinfo: $(window).height()/2 - margin.stateinfo.top - margin.stateinfo.bottom
    };
}
