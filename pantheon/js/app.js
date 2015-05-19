'use strict';

var app = angular.module('app', ['lheader']);

app.controller('Ctrl', ['$scope', '$http', function($scope, $http) {
    var allData = [];
    $scope.data = [];

    $scope.filters = {
        gender : ['', 'homme', 'femme'],
        category : []
    };

    $scope.activeFilters = {
        gender : '',
        category : ''
    };

    $http.get('data/data.csv').then(function(response) {
        var csvArray = CSVToArray(response.data);
        var csvHeader = _.first(csvArray.splice(0, 1));

        csvHeader = _.invert(csvHeader);
        allData = [];
        for (var i = 0; i < csvArray.length; ++i) {
            allData.push({
                birth : parseInt(csvArray[i][csvHeader.Naissance]),
                death : parseInt(csvArray[i][csvHeader.Mort]),
                pantheon : parseInt(csvArray[i][csvHeader['Panthéonisation']]),
                label : csvArray[i][csvHeader['Prénom']] + ' ' + csvArray[i][csvHeader.Nom],
                gender : csvArray[i][csvHeader.Sexe],
                category : csvArray[i][csvHeader['Métier']],
                id : i
            });

            if ($scope.filters.category.indexOf(csvArray[i][csvHeader['Métier']]) < 0) {
                $scope.filters.category.push(csvArray[i][csvHeader['Métier']]);
            }
        }
        $scope.data = _.clone(allData);
    });

    $scope.filter = function() {
        var filtered = _.clone(allData);

        if ($scope.activeFilters.gender.length > 0) {
            filtered = _.filter(filtered, { gender : $scope.activeFilters.gender });
        }

        if ($scope.activeFilters.category.length > 0) {
            filtered = _.filter(filtered, { category : $scope.activeFilters.category });
        }

        $scope.data = filtered;
    };
}]);