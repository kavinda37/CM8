
//Page Load GIF
var showTimeout = setTimeout(function() {
   $('.se-pre-con').fadeIn("slow");
}, 1000);

// Wait for window load
$(window).load(function () {
    // Animate loader off screen
        //$(".se-pre-con").hide();
        clearTimeout(showTimeout);
        $(".se-pre-con").fadeOut("slow");
   
});