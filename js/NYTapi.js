function runAQueryOn(state) {
    //state = code

    function svc_search_v2_articlesearch(data) {
            console.log(data);
            return;
        }

        var stuff = "http://api.nytimes.com/svc/search/v2/articlesearch.json?&fq=headline:(%22mortgage%22+%22unemployment%22+%22foreclosure%22+%22housing%22+%22economic%22+%22bankrupt%22+%22bankruptcy%22+%22economy%22+%22financial+crisis%22)+AND+glocations:(%22" + state + "%22)&page=0&begin_date=20010101&end_date=20110101&sort=oldest&api-key=eafee9bbfe698400bfc25b18cc760590:11:69291451"

        $.ajax({
          dataType: "json",
          url: stuff,
        success: function (data, status){
            
            d3.selectAll(".eventItem").remove()
            //console.log(data.response.docs)
            if(data.response.docs.length == 0){
                var metaDataObject = {
                    //states and indicators are hardcoded, change when needs be
                    states: [""],
                    years: [""],
                    indicators: ["GSP"],
                    }
                var eventItemObject = {
                    title: "Unofortunately, there are no articles available",
                    description:"",
                    linkURL: "",
                    linktext: "",
                }

                eventController.addItem(metaDataObject, eventItemObject);

            }
            else{

            
                data.response.docs.forEach(function(doc){
                 
                var articledate = doc.pub_date.substr(0,4);

                var eventItemObject = {
                    title: doc.headline.main,
                    description: doc.snippet,
                    linkURL: doc.web_url,
                    linktext: doc.source,
                }

                var metaDataObject = {
                    //states and indicators are hardcoded, change when needs be
                    states: ["TX"],
                    years: [articledate],
                    indicators: ["GSP"],
                }

                eventController.addItem(metaDataObject, eventItemObject);

                })
            }
            //console.log(data);

                }
            })
        
 

//            console.log(relevantData);
//            console.log(allValues);

            /*
            var colorScale = d3.scale.linear().domain(d3.extent(allValues)).range([colorMin,colorMax]);//.range(["#deebf7","#3182bd"]);//#9ecae1
            var controlScale = d3.scale.linear().domain(d3.extent(allValues)).range([0,1]);//#9ecae1

            svg.select("#legendMin").text(d3.min(allValues));
            svg.select("#legendMax").text(d3.max(allValues));


            coloring = function(d){
//                console.log(d.id);
                if (d.id in relevantData){
                    return colorScale(+relevantData[d.id].value)

                }else{
                    return "none"
                }
            }

            textLabelChange = function(d){
                if (d.id in relevantData){
                    d3.select("#textLabel").text(d.properties.name + " - "+relevantData[d.id].value);
                }else{
                    d3.select("#textLabel").text(d.properties.name + " - no data");
                }

            }


            d3.selectAll(".country")
                .style({
                    "fill":coloring
                })
                .on({
                    "mouseover":textLabelChange
                })

        }//,
//       error: function(error){
//            console.log("error:",error);
//        }
    */

   // });


}