/* ===================================================
*
* loading.js
* http://www.ocxers.com/demo/loading.html
* ===================================================
* Copyright 2013 Sharing.Chi
*
* Feel free to use (download, change or whatever) this plugin
* Please don't hesitate to email me if any problems
* ocxers@gmail.com
*
* ========================================================== */

// the loading img url
// please asign your own loading img url to imgUrl
var imgUrl = 'img/Icon-Search-loader.gif';

var $backdrop = null; // let it default
var subcustommodal = false; // let it default

// please call this function to addLoading
// if the custommodalId is null or undefined, the custommodal will cover the whole screen (web browser)
// else the custommodal will cover the specific div box
function addLoading(custommodalId) {
    $('.custommodal-backdrop').parent().remove();
    subcustommodal = false;
    if (custommodalId === undefined || custommodalId == null) {
        subcustommodal = false;
        // this is a demo
        // please remove the event: onclick="clearLoading()" when you use it in your our project
        $backdrop = $('<div><div class="custommodal-backdrop"></div><div class="custommodal"><img src="'
                    + imgUrl + '" alt="" title="" /></div></div>').appendTo(document.body);
    }
    else {
        subcustommodal = true;
        var p = $(custommodalId);
        var cover = "style='width:" + p.outerWidth() + "px; height: " + p.outerHeight() + "px; left: " + p.offset().left + "px; top: " + p.offset().top + "px;'";
        var custommodal = "style='left: " + (p.outerWidth() / 2 * 1 + p.offset().left * 1) + "px; top: " + (p.outerHeight() / 2 * 1 + p.offset().top * 1) + "px;'";

        // this is a demo
        // please remove the event: onclick="clearLoading()" when you use it in your our project
        $backdrop = $('<div><div class="custommodal-backdrop" ' + cover + '></div><div class="custommodal" '
                    + custommodal + '><img src="' + imgUrl + '" alt="" title="" /></div></div>').appendTo(document.body);

        // make sure to reset the top and left for custommodal when the scroll is changed
        $(window).scroll(function () {
            if (subcustommodal) {
                $($backdrop).children().each(function (index) {
                    if (index == 0) {
                        $(this).css({
                            'top': p.offset().top - $(window).scrollTop(),
                            'left': p.offset().left - $(window).scrollLeft()
                        });
                    }
                    else {
                        $(this).css({
                            'top': p.outerHeight() / 2 + p.offset().top - $(window).scrollTop(),
                            'left': p.outerWidth() / 2 + p.offset().left - $(window).scrollLeft()
                        });
                    }
                });
            }
        });
    }
}

// please call clearLoading if you want to clear the custommodal
function clearLoading() {
    $($backdrop).fadeOut(300, function () {
        $('.custommodal-backdrop').parent().remove();
    });
}