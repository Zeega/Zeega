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
    css : [],
    js  : ['//ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js'],    
//	jqpath : 'myCustomjQueryPath.js', <-- option to include your own path to jquery
    
    ready : function()
    {
        
    	var zeegaBM = {
            specialCases:{
                facebook:{
                    window_ref:null,
                    interval_ref:null,
                    launchPopupWindow:function(localUrlPrefix, target_url){
                        var popupTop_px =  window.outerHeight-window.innerHeight;
                        popupTop_px += (window.hasOwnProperty('screenTop'))?window.screenTop:window.screenY
                        var windowWidth = 460;
                        var popupLeft_px = window.outerWidth - windowWidth - 25;
                        popupLeft_px += (window.hasOwnProperty('screenLeft'))?window.screenLeft:window.screenX
                        var popupHeight_px = (window.innerHeight-40);
                        var zbm_url = localUrlPrefix + "/widget?url=" + target_url;
                        var zbm_specs = "top=" + popupTop_px + ", left=" + popupLeft_px + ", height=" + popupHeight_px + ",width=460,location=0, menubar=0, status=0, toolbar=0";
                        zeegaBM.specialCases.facebook.window_ref = window.open(zbm_url, "ZeegaBookmarklet", zbm_specs); 
                    },
                    watchPopup:function(){
                        zeegaBM.specialCases.facebook.interval_ref = window.setInterval(zeegaBM.specialCases.facebook._watchPopup, 1);

                    },
                    _watchPopup:function(){
                        console.log(zeegaBM.specialCases.facebook.window_ref);
                    }

                }
            },
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
                this.url=encodeURIComponent(window.location.href);

                // big fork for Facebook:
                if(window.location.host.indexOf('facebook')>-1){ // if facebook or other OAuth source, use popup
                    
                    zeegaBM.specialCases.facebook.launchPopupWindow(localUrlPrefix, this.url);
                    /*
                    var popupTop_px =  window.outerHeight-window.innerHeight;
                    popupTop_px += (window.hasOwnProperty('screenTop'))?window.screenTop:window.screenY
                    var windowWidth = 460;
                    var popupLeft_px = window.outerWidth - windowWidth - 25;
                    popupLeft_px += (window.hasOwnProperty('screenLeft'))?window.screenLeft:window.screenX
                    var popupHeight_px = (window.innerHeight-40);
                    var zbm_url = localUrlPrefix + "/widget?url="+this.url;
                    var zbm_specs = "top=" + popupTop_px + ", left=" + popupLeft_px + ", height=" + popupHeight_px + ",width=460,location=0, menubar=0, status=0, toolbar=0";
                    this.zbm_window = window.open(zbm_url, "ZeegaBookmarklet", zbm_specs); 
                    */
                }else{ // use iFrame
                    $('#zeega-overlay').remove();
                
                    var overlay=$('<div>').css({
                        'position':'fixed',
                        'right': 0,
                        'top':0,
                        'background-color':'#333',
                        'width':0,
                        'height':'100%',
                        'opacity':1,
                        'z-index':500000,
                        'overflow':'hidden',
                
                    }).attr('id','zeega-overlay');

                    this.url=encodeURIComponent(window.location.href);


                    $('body').append(overlay);
            
                    var cover=$('<div>').css({
                        'position':'relative',
                        'background-color':'#333',
                        'width':'100%',
                        'height':'100%',
                        'z-index':5,
                        'background-image':'url("http://zeega.org/images/zeega_clear2.png")',
                        'background-size':'100% 100%',
                
                    }).attr('id','zeega-cover');
                
                
                    var highlight=$('<div>').css({
                        'position':'absolute',
                        'left':12,
                        'top' :148,
                        'background-color':'red',
                        'width':'150px',
                        'height':'150px',
                        'border-radius' :3,
                        'z-index':60000,
                        'display':'none',
                        'opacity':0.5,
                    }).attr('id','zeega-highlight');
                
                    var close=$('<div>').css({
                        'position':'absolute',
                        'right':15,
                        'top' :10,
                        'background-color':'transparent',
                        'color':'red',
                        'cursor':'pointer',
                        'font-weight':'bold',
                        'z-index':60000,
                        'opacity':1,
                    }).attr('id','zeega-close').html('<a class="close" style="font-size:24px">&times;</a>');
                
                    overlay.append(cover);
                    overlay.append(highlight);
                    overlay.append(close);
                    
                    $('#zeega-overlay').append("<iframe id='zeega-widget-iframe' style='padding: 0px; height: 100%; width:470px; height: 100%; border:solid 1px gray' src='" + localUrlPrefix + "/widget?url="+this.url+"' />").animate({
                            'width': 470 }, 500, function() {
                                $('#zeega-cover').fadeOut('slow');
                    });
            
                    $('#zeega-overlay').droppable({
                        accept:'.zeega-draggable',  
                        out:function(event,ui)
                        {
                            $('#zeega-highlight').hide();
                        }, 
                        over: function(event,ui)
                        {
                            $('#zeega-highlight').show();
                        }, 
                        drop: function(event, ui) {
                            $('#zeega-highlight').hide(); 
                            var src=ui.draggable.attr('src'); 
                            $('#zeega-widget-iframe').attr('src',localUrlPrefix +'/widget?url='+encodeURIComponent(src));
                        }
                    });
            
                    $('body img').draggable({  
                        cursorAt: { left: 5, top:5},
                        helper:function()
                        {
                            return $(this).clone().css({'width':'75px','height':'75px','border':'2px solid red',"z-index":1000000});
                        },
                        stack: 'iframe' 
                    }).addClass('zeega-draggable').css({ 'z-index' : '100001'});

                    $('body').click(function()
                    {
                        if($(this).attr('id')!='zeega-overlay') 
                            $('#zeega-overlay').hide();
                    });
                    
                }
        	},
		}
 		zeegaBM.init();
 	}
})
 
function fullFunc(a) {
    function d(b) {
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
    a.jqpath = a.jqpath || "//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js";
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


