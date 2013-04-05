/**
 * bootstrap-demo.js
 *
 * Unofficial extension for Twitter Bootstrap that adds 'demo' functionality.
 * In case you're wondering what is meant by 'demo' functionality: think a transparent
 * overlay and a popover. A simple way to instruct the users of your application in its
 * use, now made even easier.
 *
 * This script supports both normal calls and activation using the data api. It requires
 * only Twitter Bootstrap (including jQuery and the Twitter Bootstrap popover feature)
 * to be present.
 *
 * It supports demo chaining, multiple demo popovers on-screen at the same time, and
 * makes use of cookies to make sure these annoying things only show up once (by default).
 *
 * Dependencies:
 * Twitter Bootstrap (+popover functionality) - http://twitter.github.com/bootstrap/
 *
 * Usage:
 * See the Github page @ http://kalmanolah.github.com/bootstrap-demo.js/ or the examples/
 * folder in present in the master branch for proper usage examples.
 *
 * Here's something simple:
 *     With the data api:
 *         <div data-provide="demo" data-id="6" data-content="<em>Demo!</em>">
 *             Lorem ipsum...
 *         </div>
 *
 *     In javascript:
 *         $('#selector').demo({
 *             id           : 'unoriginal-cookie-id',
 *             title        : 'ProTip (tm)',
 *             content      : 'Yeah... This tip's pretty pro alright.'
 *         });
 *
 * License:
 * MIT (See LICENSE)
 */
(function($){
	// Extend jQuery with demo function
	$.fn.demo = function(options){
		
		// Creates a cookie
		function createCookie(name,value,days) {
		    if (days) {
		        var date = new Date();
		        date.setTime(date.getTime()+(days*24*60*60*1000));
		        var expires = "; expires="+date.toGMTString();
		    }
		    else var expires = "";
		    document.cookie = name+"="+value+expires+"; path=/; domain="+window.location.hostname;
		}
		
		// Reads a cookie
		function readCookie(name){
			name += '=';
		    for (var ca = document.cookie.split(/;\s*/), i = ca.length - 1; i >= 0; i--){
		    	if (!ca[i].indexOf(name)) return ca[i].replace(name, '');
		    }
		}
		
		// Removes a cookie
		function removeCookie(name){
			createCookie(name,"",-1);
		}
		
		// Checks if a demo cookie is set
		function checkDemoCookie(id){
			return readCookie(window.location.hostname + '-demo-'+ id) != undefined;
		}
		
		// Sets a demo cookie
		function setDemoCookie(id){
			createCookie(window.location.hostname + '-demo-' + id, 'true', 365 * 10);
		}
		
		// Checks whether an element has a background of its own
		function hasBackground(elem){
		    var img = $(elem).css('backgroundImage'),
		        col = $(elem).css('backgroundColor');
		    return img != 'none' || (col != 'rgba(0, 0, 0, 0)' && col != 'transparent');
		}

	    // Set up default settings
	    var settings = $.extend({
	    	'overlay-style'				: 'position:fixed;top:0;left:0;bottom:0;right:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:1040;',
	    	'highlight-style'			: 'z-index:1050;',
	    	'highlight-position'		: 'position:relative;',
	    	'highlight-background'		: 'background:rgba(255,255,255,0.8)',
	    	'popover-style'				: 'z-index: 1060;',
	    	'placement'					: 'top',
	    	'title'						: 'TIP<i class="icon-bell pull-right"></i>',
	    	'content'					: 'Click this thingy here!',
	    	'id'						: null,
	    	'callback'					: 'false',
	    	'debug'						: false
	    }, options);
	    
	    // Set up CSS rules
	    // First, delete any existing inline styles
	    $('style[class^="demo-style-"]').remove();
	    $('<style class="demo-style-overlay" type="text/css">.demo-overlay{'+settings['overlay-style']+'}</style>').appendTo('head');
	    $('<style class="demo-style-highlight" type="text/css">.demo-highlight{'+settings['highlight-style']+'}</style>').appendTo('head');
	    $('<style class="demo-style-highlight-position" type="text/css">.demo-highlight-position{'+settings['highlight-position']+'}</style>').appendTo('head');
	    $('<style class="demo-style-highlight-background" type="text/css">.demo-highlight-background{'+settings['highlight-background']+'}</style>').appendTo('head');
	    $('<style class="demo-style-popover" type="text/css">.demo-popover{'+settings['popover-style']+'}</style>').appendTo('head');
	    
    	// Only execute if we haven't shown this demo yet
    	if(!checkDemoCookie(settings['id']) || settings['debug']){
    		
    		// Set demo cookie
    		if(!settings['debug']) setDemoCookie(settings['id']);

    		// Create overlay if it doesn't exist yet
    		if($('#demo-overlay').length == 0){
    			$('<div id="demo-overlay"></div>').appendTo('body');
    			
    			// Add CSS class to overlay
    			$('#demo-overlay').addClass('demo-overlay');
    		}
    		
    		// Highlight elements
    		this.addClass('demo-highlight');
    		// If position = static, z-index will not work, so we set the position to relative
    		if(this.css('position') == "static") this.addClass('demo-highlight-position');
    		// If this element has no background, we need to add one
    		if(!hasBackground(this)) this.addClass('demo-highlight-background');
    		
    		// Create popover on the first of the elements
    		this.first().popover({
    			html				: true,
    			placement			: settings['placement'],
    			title				: settings['title'],
    			content				: settings['content']
    		}).popover('show')
    		
    		// Set correct class on popover
    		.siblings('.popover').addClass('demo-popover');
    		
    		// Handle click
    		this.on('click.demo.data-api', function(e){
    			// Remove demo popovers
    			$('*').popover('destroy');
    			
    			// Remove overlay
    			$('#demo-overlay').remove();
    			
    			console.log('a click that\'s not unbound'); // debug
    			
    			// Remove highlight from elements
    			$('.demo-highlight').removeClass('demo-highlight').removeClass('demo-highlight-background').removeClass('demo-highlight-position');
    			
    			// Unbind other clicks and remove popovers
    			$('*').unbind('.demo.data-api');
    			
    			// Perform callback
    			return eval(settings.callback);
    		});
    	}
    	
    	// Support chaining
    	return this;
	};
	
	$(document).ready(function(){
		// We proudly support the data api
		$('[data-provide="demo"]').each(function(e){
			var $this = $(this);
			// Perform magick
			$this.demo($this.data());
		});
	});
})(jQuery);