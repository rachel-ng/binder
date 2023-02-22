var siteData;

$(function() {

	//load the json
	$.get( "info.json", function( data ) {

		//did it load json data as string or as an object?
		if (typeof data == "string") {
      data = $.parseJSON(data);
    }
			

		siteData = data;

		//create the title
		document.title = data.title; 
		
		//create the navigation
		var links = $('#navigation');
    
		for (var property in data.menu) {
    		if (data.menu.hasOwnProperty(property)) {
    			var urlsafe = property.replace(/ /gi, '-');
        	var item = $('<li class="menu-item">');

        	item.addClass(urlsafe);
				  let code = "";

          if (typeof data.menu[property] == "object") {
              let prefix = data.menu[property]["prefix"] || '';
              let postfix = data.menu[property]["postfix"] || '';

              switch (true) {
                case "link" in data.menu[property]:
                  code = `<a href="${data.menu[property]["link"]}" target="_blank" rel="noopener noreferrer">${prefix}${property}${postfix}</a>`; 
                  break;

                case "copy" in data.menu[property]:
                  code = `<a onclick="copyContent('${data.menu[property]["copy"]}')">${prefix}${property}${postfix}</a>`;
                  break;

                case "embed" in data.menu[property]:
                  code = `<a href="#${property}">${prefix}${property}${postfix}</a>`;
                  break;

                default: 
                  code = `<a href="#${property}">${prefix}${property}${postfix}</a>`;
                  break;
              }
          }
          else {
            code = `<a href="#${property}">${property}</a>`;
          }

          if (typeof data.menu[property] == "object" && "small" in data.menu[property]) {
            code = `<small>${code}</small>`
          }

          item.html(code); 	
          item.appendTo(links);

          //tmp
          var bk = data.menu[property];
        }
		}

		//create the header
    var header = $('.header');
    if (data.hasOwnProperty("header")) {
      header.html(data.header);
    }
    else {
      header.hide();
    }
    
    //create the about section
    var about = $('.about');
    if (data.hasOwnProperty("about")) {
      about.html(data.about);
    }
    else {
      about.hide();
    }
  
		//load the google doc
		locationHashChanged();

		$('#menu-open').click(function(){
			$("#navigation").toggle();
			$("#menu").toggleClass("border");
		});

		$("#menu").draggable({ cancel: "li" });
    	// $( "div, p" ).disableSelection();
	});

    // Keep navigation from getting borked when dragged on wider views
    // and reset it gracefully when transitioning to narrower views
    // 768 matches the CSS mobile breakpoint, if you change it here
    // change it in the CSS as well. Thanks!
    //          
    // N.B. If touch-punch is imported, this doesn't prevent moving the menu
    // around on touch devices. If you don't like that remove touch-punch.
    $(window).resize(function() {
        if(window.innerWidth < 768) {
            $("#menu").draggable('disable').attr('style','');
        } else if(window.innerWidth > 768) {
            $("#menu").draggable('enable');
            $("#navigation").attr('style','');
        };
    });
	
	//little fix for the iframe size on mobile
	//mobile hack
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 		mobile = true;
        // Add body class to target styles for touch devices with CSS
        $('body').addClass('touch-device');
	}

});

const copyContent = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Content copied to clipboard');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
}

function locationHashChanged() {
	var item = window.location.hash;
	item = item.replace('#','');
	item = decodeURI(item); 
	$('li a').removeClass('active');

	if (siteData.menu.hasOwnProperty(item)){
    // embed with object 
    if ($.isPlainObject(siteData.menu[item]) && siteData.menu[item].hasOwnProperty("embed")) {
      $('#backgrnd').attr('src', siteData.menu[item]["embed"]);
    } 
    else {
      $('#backgrnd').attr('src', siteData.menu[item]);
    }
    
    var comment = $('.comment');
    if ($.isPlainObject(siteData.menu[item]) && siteData.menu[item].hasOwnProperty("comment")) {
      comment.html(siteData.menu[item]["comment"]);
    } 
    else {
      comment.html("");
    }
		
		var urlsafe = item.replace(/ /gi, '-');
		$('.'+urlsafe+' a').addClass('active');
	} else {
		//load the first one
		$('#backgrnd').attr('src', siteData.menu[Object.keys(siteData.menu)[0]]);
		var urlsafe = item.replace(/ /gi, '-');
		$('li a').first().addClass('active');
	}
}

window.onhashchange = locationHashChanged;