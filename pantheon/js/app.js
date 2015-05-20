'use strict';

var app = angular.module('app', ['lheader', 'ngAnimate']);

app.controller('Ctrl', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
    var allData = [];
    $scope.data = [];

    $scope.filters = [
        {
            label : 'Tous',
            f : function() {
                $scope.activeFilters = { gender : '' , category : '' };
            }
        },
        {
            label : 'Femmes',
            f : function() {
                $scope.activeFilters = { gender : 'femme' , category : '' };
            }
        },
        {
            label : 'Hommes',
            f : function() {
                $scope.activeFilters = { gender : 'homme' , category : '' };
            }
        }
    ];

    $scope.activeFilters = {
        gender : '',
        category : ''
    };

    $scope.steps = [];
    $scope.currentStep = 0;

    $http.get('data/steps.csv').then(function(response) {
        var csvArray = CSVToArray(response.data);
        var csvHeader = _.first(csvArray.splice(0, 1));
        csvHeader = _.invert(csvHeader);

        for (var i = 0; i < csvArray.length; ++i) {
            $scope.steps.push({
                title : csvArray[i][csvHeader.Titre],
                ids : _.map(csvArray[i][csvHeader.Ids].split(','), function(d) {
                    return parseInt(d);
                }),
                desc : $sce.trustAsHtml(csvArray[i][csvHeader.Texte])
            });

            if (isNaN($scope.steps[$scope.steps.length - 1].ids[0])) {
                $scope.steps[$scope.steps.length - 1].ids = [];
            }
        }
    });

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
                id : parseInt(csvArray[i][csvHeader.id]),
                fadedout : [62, 52].indexOf(parseInt(csvArray[i][csvHeader.id])) >= 0
            });
        }
        $scope.data = _.clone(allData);
        $scope.filter($scope.steps[$scope.currentStep].ids);
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
            $scope.filter($scope.steps[$scope.currentStep].ids);
        }
    };

    $scope.nextStep = function() {
        if (!$scope.isLastStep()) {
            ++$scope.currentStep;
            $scope.filter($scope.steps[$scope.currentStep].ids);
        }
    };
}]);