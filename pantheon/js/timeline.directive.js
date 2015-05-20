'use strict';

angular.module('app').directive('timeline', ['$timeout', function($timeout) {
    return {
        restrict : 'AE',
        scope : {
            data : '='
        },
        link : function($scope, $element) {
            var currentYear = (new Date(Date.now())).getFullYear();

            var svg = d3.select($element[0]).append('svg');
            var margin = {
                top: 0,
                right: 30,
                bottom: 30,
                left: 30,
                between : 15
            };
            var barHeight = margin.between * 1.5;
            var width = $element.width() - margin.left - margin.right;
            var height = margin.top + margin.bottom + ($scope.data.length * (barHeight + margin.between));
            svg.attr('width', width).attr('height', height);
            svg = svg.append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
            var bars = svg.append('g').attr('class', 'bars');
            var x;

            var getY = function(d, i) {
                return margin.between  + (i * (barHeight + margin.between));
            };

            var refresh = function() {
                height = margin.top + margin.bottom + ($scope.data.length * (barHeight + margin.between));
                d3.select($element[0]).select('svg').attr('height', height);

                if (x == null) {
                    x = d3.scale.linear()
                          .domain([d3.min($scope.data, function(d) { return d.birth; }) - 5,
                                   currentYear + 5])
                          .range([0, width]);

                    var rulers = svg.insert('g', '.bars').attr('class', 'rulers');
                    _.each(x.ticks(), function(tick) {
                        rulers.append('line').attr('class', 'ruler')
                              .attr('x1', x(tick)).attr('x2', x(tick))
                              .attr('y1', 0).attr('y2', height);
                    });
                }

                // Start drawing
                var bar = bars.selectAll('.bar').data($scope.data, function(d) { return d.id; });
                var entered = bar.enter().append('g').attr('class', 'bar');
                bar.exit().remove();

                bar.sort(function(a, b) {
                    return d3.descending(a.pantheon, b.pantheon);
                });

                bar.sort(function(a, b) {
                    if (a.filteredOut === b.filteredOut) {
                        return 0;
                    }
                    return a.filteredOut ? 1 : -1;
                });

                entered.append('rect').attr('class', 'life')
                   .attr('x', function(d) { return x(d.birth); })
                   .attr('width', function(d) { return x(d.death) - x(d.birth); })
                   .attr('height', barHeight)
                   .attr('y', 0);

                entered.append('rect').attr('class', 'pantheon')
                       .attr('x', function(d) { return x(d.pantheon); })
                       .attr('width', function(d) { return (x(currentYear) - x(d.pantheon)) || 1; })
                       .attr('height', barHeight)
                       .attr('y', 0);

                entered.append('text').text(function(d) { return d.label; })
                   .attr('text-anchor', 'start').attr('alignment-baseline', 'central')
                   .attr('x', function(d) { return x(d.birth); })
                   .attr('y', 0);

                // Re-compute y positions
                bars.selectAll('.bar').select('rect.life')
                    .transition().attr('y', getY)
                                 .style('fill', function(d) { return d.filteredOut ? '#ddd' : '#222'; });

                bars.selectAll('.bar').select('rect.pantheon')
                    .transition().attr('y', getY)
                                 .style('fill', function(d) { return d.filteredOut ? '#eee' : '#aaa'; });

                bars.selectAll('.bar').select('text')
                    .transition()
                    .attr('y', function(d, i) { return barHeight + getY(d, i); });
            };

            var refreshWidth = function() {
                width = $element.width() - margin.left - margin.right;
                x = d3.scale.linear()
                      .domain([d3.min($scope.data, function(d) { return d.birth; }) - 5,
                               d3.max($scope.data, function(d) { return d.pantheon; }) + 5])
                      .range([0, width]);

                bars.selectAll('.bar').select('rect.life')
                    .attr('x', function(d) { return x(d.birth); })
                    .attr('width', function(d) { return x(d.death) - x(d.birth); });

                bars.selectAll('.bar').select('rect.pantheon')
                    .attr('x', function(d) { return x(d.pantheon); })
                    .attr('width', function(d) { return (x(currentYear) - x(d.pantheon)) || 1; });

                bars.selectAll('.bar').select('text')
                    .attr('x', function(d) { return x(d.birth); });
            };

            $scope.$watch('data', function() {
                if ($scope.data != null && $scope.data.length > 0) {
                    refresh();
                }
            });

            angular.element(window).on('resize', (function() {
                var timeout; // We're doing some sort of debounce to call this
                return function() { // handler only when the resize is finished.
                    $timeout.cancel(timeout);
                    timeout = $timeout(function() {
                        if ($scope.data != null && $scope.data.length > 0) {
                            refreshWidth();
                        }
                    }, 100);
                };
            })());
        }
    };
}]);

angular.module('app').directive('axis', ['$timeout', function($timeout) {
    return {
        restrict : 'AE',
        scope : {
            data : '='
        },
        link: function($scope, $element) {
            var currentYear = (new Date(Date.now())).getFullYear();
            var x, axis;
            var margin = 30;
            var width = $element.width() - (margin * 2);
            var height = 50;
            var svg = d3.select($element[0]).append('svg');
            svg.attr('width', width).attr('height', height);

            var refresh = function() {
                x = d3.scale.linear()
                      .domain([d3.min($scope.data, function(d) { return d.birth; }) - 5,
                               currentYear + 5])
                      .range([0, width]);

                axis = d3.svg.axis().scale(x).orient('top');

                svg.selectAll('.axis').remove();
                svg.append('g').attr('class', 'axis').attr('transform', 'translate(' + margin + ', ' + height + ')')
                   .call(axis);
            };

            $scope.$watch('data', function() {
                if ($scope.data != null && $scope.data.length > 0) {
                    refresh();
                }
            });

            angular.element(window).on('resize', (function() {
                var timeout; // We're doing some sort of debounce to call this
                return function() { // handler only when the resize is finished.
                    $timeout.cancel(timeout);
                    timeout = $timeout(function() {
                        width = $element.width() - (margin * 2);
                        refresh();
                    }, 100);
                };
            })());
        }
    };
}]);