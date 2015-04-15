/*
	Parallax plugin v1.1
	December, 2013
	
	Author : BeliG
	Doc : http://www.design-fluide.com/?p=987
 */

(function($){
	$.fn.parallax = function(options){
	
		/*** Init ***/
		var $$ = $(this); // Cache current object
		var offset = $$.offset(); // Cache offset
		var position = $$.position(); // Cache position
		var defaults = {
			'coeff' : 0,
			'type'  : 'background',
			'visibility' : $$.css('visibility'),
			'position' : $$.css('position')
		};
		var opts = $.extend(defaults, options); // Merging with user options

		/*** [function] Get background position X ***/
		var getBgPosX = function(elt) {
			if( elt.css('backgroundPosition') == undefined ) { return elt.css('backgroundPositionX'); } // IE8-
			else { return elt.css('backgroundPosition').split(' ')[0]; } // Get position and return first value (= background position X)
		};					

		/*** [function] Move background ***/
		var makeThatMove = function(windowTop) {
			newPos = windowTop * opts.coeff; // Scrolled distance * coeff
			if( opts.type == 'sprite' ) { // If sprite, add initial position
				newPos += opts.position == 'fixed' ? position.top : offset.top; // Use position() with fixed element cause browsers dont return the same value with offset()
			}
			$$.css( 'background-position', getBgPosX($$) + ' ' + newPos + 'px' ); // Update background-position
		};

		/*** For each selector ***/
		return this.each(function(){

			/* Init position */
			var bgPosX = Math.round(offset.left); // Rounded to avoid sh*tty stack with some browsers (isn'it Chrome ?)
			if ( opts.type == 'sprite' ) {
				bgPosX += parseInt( getBgPosX($$) ); // Add initial position
				$$.css({
					backgroundPosition : bgPosX + 'px ' + offset.top + 'px', // Align with container
					top : 0,
					bottom : 0,
					height : 'auto'								
				// left : offsetLeft, right : 'auto', marginLeft : 0, marginRight : 0 // Try this if stack s*cks
				});							
			}
			else if ( bgPosX != 0 ) { // Background which doesn't start at left
				$$.css('background-position', bgPosX + 'px 0px'); // Align with container
			}

			/* Magic trick */
			$$.css('background-attachment', 'fixed');

			/* Loading */
			var windowTop = $(window).scrollTop(); // Scrolled distance
			if ( windowTop > 0 ) { makeThatMove(windowTop); } // Mhm, not on top, move background in the right place
			if ( opts.visibility == 'hidden') { $$.css('visibility', 'visible'); } // Show tits

			/* Scrolling */
			$(window).bind('scroll', function() {
				windowTop = $(window).scrollTop(); // Scrolled distance
				if ( windowTop < parseInt( offset.top + $$.height() ) && parseInt( $(window).height() + windowTop ) > offset.top ) { // If visible (in view area)
					makeThatMove(windowTop); // Update pos
				}
			});
		});
	};
})(jQuery);	