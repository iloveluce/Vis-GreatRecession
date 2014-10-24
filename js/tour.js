   // Define the tour!
    var tour = {
      id: "hello-hopscotch",
      steps: [
        {
          title: "The Recession Tour",
          content: "Take a tour to understand how to use this visualization to better see the Great Recession",
          target:"mainheader",
          placement: "right"
        },
        {
          title: "Parallel Coordinates Button",
          content: "Click this text to change the statistic you are visualizing. This changes the color scheme and values of chlorpleth map based on statistic choosen",
          target: "paxistitle",
          placement: "bottom",
          //onNext: updateStatistic("GSP")
        },
         {
          title: "Parallel Coordinates Brush",
          content: "Click, hold, and drag to select on states within the scope of your brush",
          target: "paxis",
          placement: "right",
          onNext: play
        },
        {
          title: "Change Year",
          content: "Click on a year to change the year in focus for both the Chloropleth Map and the Parallel Coordinates. Click and drag is also enabled.",
          target: "touryear",
          placement: "top",
          onNext: activateModeButton
        },
        {
          title: "Axes by Year",
          content: "Click this button to change the min and max values for each indicator -- Either displays the range of all ten years, or just calculates the colors and ranges based on one year",
          target: "by_state",
          placement: "left",
          onNext: zoomla
        },
        {
          title: "Focus on One State",
          content: "Click the State to zoom-in and focus on statistics for this state for the given year",
          target: "tourstate",
          placement: "bottom",

        },
        {
          title: "State Analysis",
          content: "Statistics for this state for the given year",
          target: "eventsBar",
          placement: "bottom",

        },
        {
          title: "Line Graphs",
          content: "While zoomed-in we can compare the state selected directly to the US statistics",
          target: "svg-sline4",
          placement: "right",
          onNext: zoomla
        }
      ]
    };


    function zoomla(){
      zoom(tourla)
    }
