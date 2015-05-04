$(function() {
	// Register menu actions
	$('#menu li a').on('click', function(event) {
		event.preventDefault();
		console.debug($(this).attr('rel'))
	});

	$('#menu li:first-of-type').addClass('selected');

    //   $('.isotope').isotope({
    //     itemSelector : '.pages',
    //     masonry : {
    //       columnWidth : 100
    //     }
    //   });
});

