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
 
bookmarklet = function(opts){fullFunc(opts)};
 
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
	            if(srcUrlIdx == -1)
	            	srcUrlIdx = script.src.indexOf("/gamma/");
	            var localUrlPrefix = script.src.substring(0,srcUrlIdx);
		    
                    if(srcUrlIdx != -1)
			localUrlPrefix = localUrlPrefix + "/web";
	
				//console.log("local " + localUrlPrefix);
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
			
			
        		overlay.append(cover);
        		overlay.append(highlight);
				
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
            		    $('#zeega-widget-iframe').attr('src',localUrlPrefix +'/web/app_dev.php/widget?url='+encodeURIComponent(src));
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
			
        		//$('#zeega-widget-iframe').ready(function(event){console.log(event);});
			
        		$('body').click(function()
        		{
        		    if($(this).attr('id')!='zeega-overlay') 
        		        $('#zeega-overlay').hide();
        		});
        	},
		}
 		zeegaBM.init();
 	}
})
 
function fullFunc(a){function d(b){console.log(b);if(b.length===0){a.ready();return false}$.getScript(b[0],function(){d(b.slice(1))})}function e(b){$.each(b,function(c,f){$("<link>").attr({href:f,rel:"stylesheet"}).appendTo("head")})}a.jqpath=a.jqpath||"http://code.jquery.com/jquery-1.6.4.js";(function(b){var c=document.createElement("script");c.type="text/javascript";c.src=b;c.onload=function(){e(a.css);d(a.js)};document.body.appendChild(c)})(a.jqpath)};



