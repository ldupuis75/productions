'use strict';

var app = angular.module('app', ['lheader']);

app.controller('Ctrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.data = { };
    var categories = ['greece', 'africa', 'italy', 'china', 'sushis'];

    var prefix = '';
    if ($location.absUrl().indexOf('iframe') >= 0) {
        prefix = '../';
    }

    $http.get(prefix + 'data/data.csv').then(function(response) {
        var csvArray = CSVToArray(response.data);

        for (var i in categories) {
            if (categories.hasOwnProperty(i)) {
                var category = categories[i];
                $scope.data[category] = { };
                for (var j = 1; j < csvArray.length; ++j) {
                    $scope.data[category][parseFloat(csvArray[j][0])] = parseFloat(csvArray[j][parseInt(i) + 1]);
                }
            }
        }
    });
}]);