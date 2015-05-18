'use strict';

var app = angular.module('app', ['lheader']);

app.controller('Ctrl', ['$scope', '$http', function($scope, $http) {
    $scope.data = { };
    var categories = ['greece', 'africa', 'italy', 'china', 'sushis'];

    $http.get('data/data.csv').then(function(response) {
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