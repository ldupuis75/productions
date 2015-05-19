'use strict';

angular.module('app').directive('timeline', ['$timeout', function($timeout) {
    return {
        restrict : 'AE',
        scope : {
            data : '='
        },
        link : function($scope, $element) {
            var svg = d3.select($element[0]).append('svg');
            var margin = {
                top: 30,
                right: 30,
                bottom: 30,
                left: 30,
                between : 7
            };
            var barHeight = 20;
            var width = $element.width() - margin.left - margin.right;
            var height = margin.top + margin.bottom + ($scope.data.length * (barHeight + margin.between));
            svg.attr('width', width).attr('height', height);
            svg = svg.append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
            var bars = svg.append('g').attr('class', 'bars');

            var x, axis;

            var getY = function(d, i) {
                return margin.between  + (i * (barHeight + margin.between));
            };

            var refresh = function() {
                height = margin.top + margin.bottom + ($scope.data.length * (barHeight + margin.between));
                d3.select($element[0]).select('svg').attr('height', height);

                if (x == null) {
                    x = d3.scale.linear()
                                    .domain([d3.min($scope.data, function(d) { return d.birth; }) - 5,
                                             d3.max($scope.data, function(d) { return d.pantheon; }) + 5])
                                    .range([0, width]);

                    axis = d3.svg.axis().scale(x).orient('top');
                }

                // Start drawing
                var bar = bars.selectAll('.bar').data($scope.data, function(d) { return d.id; });
                var entered = bar.enter().append('g').attr('class', 'bar');
                bar.exit().remove();

                bar.sort(function(a, b) {
                    return d3.descending(a.pantheon, b.pantheon);
                });

                entered.append('rect').attr('class', function(d) { return d.gender; })
                   .attr('x', function(d) { return x(d.birth); })
                   .attr('width', function(d) { return x(d.death) - x(d.birth); })
                   .attr('height', barHeight)
                   .attr('y', 0);

                entered.append('line').attr('class', function(d) { return d.gender; })
                   .attr('x1', function(d) { return x(d.death); })
                   .attr('x2', function(d) { return x(d.pantheon); })
                   .attr('y1', 0).attr('y2', 0);

                entered.append('line').attr('class', function(d) { return 'end ' + d.gender; })
                   .attr('x1', function(d) { return x(d.pantheon); })
                   .attr('x2', function(d) { return x(d.pantheon); })
                   .attr('y1', 0).attr('y2', 0);

                entered.append('text').text(function(d) { return d.label; })
                   .attr('text-anchor', 'start').attr('alignment-baseline', 'central')
                   .attr('x', function(d) { return x(d.birth); })
                   .attr('y', 0);

                // Re-compute y positions
                bars.selectAll('.bar').select('rect')
                    .transition().attr('y', getY);

                bars.selectAll('.bar').select('line')
                    .transition()
                    .attr('y1', function(d, i) { return getY(d, i) + (barHeight / 2); })
                    .attr('y2', function(d, i) { return getY(d, i) + (barHeight / 2); });

                bars.selectAll('.bar').select('line.end')
                    .transition()
                    .attr('y1', getY).attr('y2', function(d, i) { return getY(d, i) + barHeight; });

                bars.selectAll('.bar').select('text')
                   .transition()
                   .attr('y', function(d, i) { return barHeight + getY(d, i); });

                svg.selectAll('.axis').remove();
                svg.append('g').attr('class', 'axis')
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
                        refresh();
                    }, 100);
                };
            })());
        }
    };
}]);