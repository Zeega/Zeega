/*
 * jQuery Bookmarklet - version 1.0
 * Originally written by: Brett Barros
 * With modifications by: Paul Irish
 *
 * If you use this script, please link back to the source
 *
 * Copyright (c) 2010 Latent Motion (http://latentmotion.com/how-to-create-a-jquery-bookmarklet/)
 * Released under the Creative Commons Attribution 3.0 Unported License,
 * as defined here: http://creativecommons.org/licenses/by/3.0/
 *
 */
 
bookmarklet = function(opts){
    fullFunc(opts)
};

// These are the styles, scripts and callbacks we include in our bookmarklet:
var bm = new bookmarklet({
    css : ['http:///core.zeega.org/Libraries/css/style.css'],
    js  : ['http://core.zeega.org/Libraries/js/jquery-ui.min.js'],    
//	jqpath : 'myCustomjQueryPath.js', <-- option to include your own path to jquery
    
    ready : function()
    {
        
    	var zeegaBM = {
	        init: function(){
	            /* DYNAMIC URL FOR THE BOOKMARKLET - TEMPORARY - CREATE A GLOBAL METHOD OR VARIABLE FOR THIS */
	            var script = document.getElementById('zeegabm');
	            
	            var srcUrlIdx = script.src.indexOf("/web/");
	            var localUrlPrefix;
	
				if(srcUrlIdx == -1){
	            	srcUrlIdx = script.src.indexOf("/js/widget/");
	            	localUrlPrefix = script.src.substring(0,srcUrlIdx);
	            }
	            else{
	            	localUrlPrefix = script.src.substring(0,srcUrlIdx) + "/web";
	            }
                // extract URL
        		this.url=encodeURIComponent(window.location.href);
                var popupTop_px =  window.outerHeight-window.innerHeight;
                popupTop_px += (window.hasOwnProperty('screenTop'))?window.screenTop:window.screenY
                var windowWidth = 460;
                var popupLeft_px = window.outerWidth - windowWidth - 25;
                popupLeft_px += (window.hasOwnProperty('screenLeft'))?window.screenLeft:window.screenX
                var popupHeight_px = (window.innerHeight-40);
                //var popupLeft_px = (window.hasOwnProperty('screenLeft'))?window.screenLeft:window.screenX //+ window.outerWidth - windowWidth - 25;
                console.log(popupLeft_px, (window.hasOwnProperty('screenLeft'))?window.screenLeft:window.screenX , window.outerWidth , windowWidth)
                var zbm_url = localUrlPrefix + "/widget?url="+this.url;
                var zbm_specs = "top=" + popupTop_px + ", left=" + popupLeft_px + ", height=" + popupHeight_px + ",width=460,location=0, menubar=0, status=0, toolbar=0";
                console.log(zbm_specs);
                this.zbm_window = window.open(zbm_url, "_blank", zbm_specs); 

			
        		
        		$('body').click(function()
        		{
                  console.log("click!!!!")
        		    if($(this).attr('id')!='zeega-overlay') 
        		        $('#zeega-overlay').hide();
        		});
        		
        
  
        	},
		}
 		zeegaBM.init();
 	}
})
 
function fullFunc(a) {
    function d(b) {
        console.log(b);
        if (b.length === 0) {
            a.ready();
            return false
        }
        $.getScript(b[0], function () {
            d(b.slice(1))
        })
    }
    function e(b) {
        $.each(b, function (c, f) {
            $("<link>").attr({
                href: f,
                rel: "stylesheet"
            }).appendTo("head")
        })
    }
    a.jqpath = a.jqpath || "http://code.jquery.com/jquery-1.6.4.js";
    (function (b) {
        var c = document.createElement("script");
        c.type = "text/javascript";
        c.src = b;
        c.onload = function () {
            e(a.css);
            d(a.js)
        };
        document.body.appendChild(c)
    })(a.jqpath)
};


