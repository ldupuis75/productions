var app = angular.module('app', ['lheader']);

app.controller('Ctrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
    $scope.regions = {};

    $rootScope.$on('map:clicked', function(event, id) {
        if ($scope.regions[id] != null) {
            $rootScope.$broadcast('scroll:to', 'r' + id);
        }
    });

    $rootScope.$on('scroll:from', function(event, id) {
        $rootScope.$broadcast('map:click', id.slice(1, id.length));
    });

    $http.get('data/data.csv').then(function(data) {
        var lines = CSVToArray(data.data);
        var headers = lines[0];
        lines = lines.slice(1, lines.length);
        for (var i = 0; i < lines.length; ++i) {
            var item = { };
            for (var j = 0; j < lines[i].length; ++j) {
                item[headers[j]] = lines[i][j];
            }
            item['autres candidats'] = item['autres candidats'].split('|');
            $scope.regions[item.id] = item;
        }
    });
}]);