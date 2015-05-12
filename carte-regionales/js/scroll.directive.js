angular.module('app').directive('scroll', ['$rootScope', function($rootScope) {
    return {
        restrict : 'A',
        scope : { },
        link : function($scope, element, attrs) {
            $rootScope.$on('scroll:to', function(event, id) {
                var top = angular.element('#' + id)[0].offsetTop - element[0].offsetTop;

                angular.element(element).animate({
                    scrollTop : top
                });
            });

            $(element).on('wheel', function(event) {
                var top = angular.element(element).scrollTop() + element[0].offsetTop;
                var all = $(element).children('*');
                for (var i = 0; i < all.length; ++i) {
                    if (all[i].offsetTop >= top) {
                        var id = $(all[i]).attr('id');
                        $rootScope.$broadcast('scroll:from', id);
                        break;
                    }
                }
            });
        }
    };
}]);