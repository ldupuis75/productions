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

    $scope.steps = [{
        show : [76],
        title : 'Lorem ipsum 1'
    }, {
        show : [55, 67, 12, 1],
        title : 'Lorem ipsum 2'
    }, {
        show : [],
        title : 'Lorem ipsum 3'
    }];
    $scope.currentStep = 0;

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
        $scope.filter($scope.steps[$scope.currentStep].show);
    });

    $scope.filter = function(ids) {
        if (ids == null || ids.length <= 0) {
            $scope.data = _.map(allData, function(datum) {
                datum.filteredOut = false;

                for (var i in $scope.activeFilters) {
                    if ($scope.activeFilters.hasOwnProperty(i) &&
                        $scope.activeFilters[i].length > 0) {
                        datum.filteredOut |= datum[i] !== $scope.activeFilters[i];
                    }
                }

                return datum;
            });
        } else {
            $scope.data = _.map(allData, function(datum) {
                datum.filteredOut = ids.indexOf(datum.id) < 0;
                return datum;
            });
        }
    };

    $scope.isFirstStep = function() {
        return $scope.currentStep === 0;
    };

    $scope.isLastStep = function() {
        return $scope.currentStep === $scope.steps.length - 1;
    };

    $scope.prevStep = function() {
        if (!$scope.isFirstStep()) {
            --$scope.currentStep;
            $scope.filter($scope.steps[$scope.currentStep].show);
        }
    };

    $scope.nextStep = function() {
        if (!$scope.isLastStep()) {
            ++$scope.currentStep;
            $scope.filter($scope.steps[$scope.currentStep].show);
        }
    };
}]);