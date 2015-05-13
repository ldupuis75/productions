angular.module('app').directive('map', ['$rootScope', function($rootScope) {
    return {
        restrict : 'AE',
        scope : { },
        template : '<object id="map" data="data/regions.svg" type="image/svg+xml"></object>',
        link: function($scope, element, attrs) {
            var regions = undefined;
            var selected = undefined;

            var baseColor = "#D1D3D4";
            var hoverColor = "#C0C2C3";
            var selectedColor = "#B0B1B2";

            var onMouseEnter = function() {
                regions.find('path, polygon').css('fill', baseColor);
                $(this).css('fill', hoverColor);
                if (selected != null) {
                    selected.css('fill', selectedColor);
                }
            };

            var onMouseLeave = function() {
                regions.find('path, polygon').css('fill', baseColor);
                if (selected != null) {
                    selected.css('fill', selectedColor);
                }
            };

            var onClick = function(event) {
                var id = $(this).attr('id');
                if (['', '14', '17'].indexOf(String(id)) >= 0) { return; }

                regions.find('path, polygon').css('fill', baseColor);
                if (selected == null || id !== selected.attr('id')) {
                    if (event != null) {
                        $rootScope.$broadcast('map:clicked', id);
                    }
                }
                selected = $(this);
                selected.css('fill', selectedColor);
            };

            $rootScope.$on('map:click', function(event, id) {
                if (regions != null) {
                    var region = regions.find('#' + id);
                    onClick.bind(region)();
                }
            });

            document.getElementById('map').addEventListener("load", function() {
                svgDocument = $(this.getSVGDocument());
                regions = svgDocument.find('#régions');
                regions.find('path, polygon')
                   .on('mouseenter', onMouseEnter)
                   .on('mouseleave', onMouseLeave)
                   .on('click', onClick)
                   .css({
                        cursor : 'pointer'
                   });

                svgDocument.find('#noms').css('pointer-events', 'none');
            });
        }
    }
}]);