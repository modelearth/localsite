$(document).ready(function(){
	// Get the levels below root
 	var foldercount = (location.pathname.split('/').length - 1) - (location.pathname[location.pathname.length - 1] == '/' ? 1 : 0);
 	var climbcount = foldercount;
 	if(location.host.indexOf('localhost') >= 0) {
 		//climbcount = foldercount - 1;
 	}
 	var climbpath = "";
 	for (var i = 0; i < climbcount; i++) {
 		climbpath += "../";
 	}


	if(location.host.indexOf('localhost') < 0) {
		  var div = $("<div />", {
		    html: '<style>.localonly{display:none}</style>'
		  }).appendTo("body");
	} else {
		var div = $("<div />", {
		    html: '<style>.localonly{display:block !important}</style>'
		  }).appendTo("body");
	}
 	$("#header").load( climbpath + "localsite/header.html", function( response, status, xhr ) {

 		//climbpath = ""
 		$("#header a[href]").each(function() {
 		  if($(this).attr('href').indexOf('http') < 0) {
	      	
	      	if (location.host.indexOf('localhost') >= 0) {
	      		$(this).attr("href", climbpath + $(this).attr('href'));
	      	} else {
	      		// replace localsite.github.io with localsite
	      		$(this).attr("href", climbpath + $(this).attr('href').replace("localsite.github.io/",""));
	      	}
	  	  }
	    })
 		$("#header img[src]").each(function() {
	      $(this).attr("src", climbpath + $(this).attr('src'));
	    })

 		$("#footer a[href]").each(function() {
 		  if($(this).attr('href').indexOf('http') < 0) {
	        $(this).attr("href", climbpath + $(this).attr('href'));
	  	  }
	    })
	    $("#footer img[src]").each(function() {
	      $(this).attr("src", climbpath + $(this).attr('src'));
	    })

 		$('.showMenu').click(function () {
			//$(".showMenu").hide();
			$(".navLinks").hide();
			$("#menuHolder").show();
			$("#menuHolder").css('margin-right','0px')
			//$("#itemMenu").appendTo($(this).parent().parent());
			event.stopPropagation();
		});
		$('.hideMenu').click(function () {
			$("#menuHolder").show();
			$("#menuHolder").css('margin-right','-250px');
			//$("#itemMenu").appendTo($(this).parent().parent());
			event.stopPropagation();
		});
		$(document).click(function(event) { // Hide open menus
			if($("#menuHolder").css('display') !== 'none') {
            	$("#menuHolder").hide(); // Since menu motion may freeze when going to another page.


            	if (!$(event.target).parents("#menuHolder").length) {
            		event.preventDefault();
            		//event.stopPropagation();
            	}
        	}
		});
	});
});