$(function() {
	var activateSection = function(className) {
		// Change colors
		$('.wrapper').removeClass('wrapper-une-phrase wrapper-en-details wrapper-dans-la-vraie-vie wrapper-avec-des-poissons');
		$('.wrapper').addClass('wrapper-' + className);

		// Activate menu item
		$('#menu li').removeClass('selected');
		$('#menu li.' + className).addClass('selected');

		// Change what is displayed
		$('.pages .une-phrase').hide();
		$('.pages .en-details').hide();
		$('.pages .dans-la-vraie-vie').hide();
		$('.pages .avec-des-poissons').hide();
		$('.pages .' + className).show();
	};

	// Register menu actions
	$('#menu li a').on('click', function(event) {
		event.preventDefault();
		activateSection($(this).attr('rel'));
	});

	activateSection('une-phrase');

      $('.isotope').isotope({
        itemSelector : '.pages',
        masonry : {
          columnWidth : 50
        }
      });
});

