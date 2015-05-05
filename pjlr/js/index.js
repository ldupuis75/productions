$(function() {
	var callIsotope = function(className) {
		$('.isotope').isotope({
			itemSelector : '.pages',
			masonry : {
			  columnWidth : '.pages'
			},
			filter: function() {
				return $(this).children('p.' + className).text().length > 0;
			}
		});
	};

	var activateSection = function(className) {
		// Change colors
		$('.wrapper').removeClass('wrapper-une-phrase wrapper-en-details wrapper-quel-probleme wrapper-dans-la-vraie-vie wrapper-avec-des-poissons wrapper-savoir-plus');
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

		// Reorder content
		callIsotope(className);
	};

	// Register menu actions
	$('#menu li a').on('click', function(event) {
		event.preventDefault();
		activateSection($(this).attr('rel'));
	});

	// Twitter buttons
	$('.pages .une-phrase').on('mouseenter', function() {
		$(this).find('.twitter-share-button').show();
	});
	$('.pages .une-phrase').on('mouseleave', function() {
		$(this).find('.twitter-share-button').hide();
	});
	$('.pages .une-phrase').each(function() {
		var button = $('<a href="#" class="twitter-share-button"><i class="fa fa-twitter"></i></a>');
		var text = $(this).siblings('h3').text() + " : j'ai compris ";
		var link = "https://twitter.com/intent/tweet?original_referer=" + "" + "&text=" + text + "&url=";
		button.on('click', function(event) {
			event.preventDefault();
			window.open(link);
		});
		$(this).append(button);
	});

	$('body').append($('<div>').addClass('hidden'));

	// Initialize
	activateSection('une-phrase');

	// Check if there's a #
	if (window.location.hash != null) {
		if (window.location.hash.match('#page-[0-9]')) {
			$('#' + window.location.hash.slice(1, window.location.hash.length)).addClass('highlighted');
		}
	}
});