'use strict';

angular.module('app').directive('histogram', ['$rootScope', function($rootScope) {
    return {
        restrict : 'A',
        scope : {
            data : '=',
            title : '@'
        },
        link : function($scope, $element, attrs) {

            var refresh = function() {
                d3.select($element[0]).selectAll('svg').remove();
                var svg = d3.select($element[0]).append('svg');
                var margin = {
                    top: 75,
                    right: 30,
                    bottom: 30,
                    left: 30
                };
                var width = $element.width() - margin.left - margin.right;
                var height = $element.height() - margin.top - margin.bottom;
                svg.attr('width', width).attr('height', height);
                svg = svg.append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

                var _data = [];
                for (var i in $scope.data) {
                    if ($scope.data.hasOwnProperty(i)) {
                        if (!isNaN(i)) {
                            _data.push({
                                x : parseFloat(i),
                                y : $scope.data[i]
                            });
                        }
                    }
                }

                var x = d3.scale.ordinal().domain(_data.map(function(d) { return d.x; }).sort())
                          .rangeRoundBands([0, width]);
                var xAxis = d3.svg.axis().scale(x).orient('bottom');

                var y = d3.scale.linear().domain([0, d3.max(_data, function(d) { return d.y; })])
                          .range([height, 0]);

                svg.append('g').attr('class', 'bars');
                var bar = svg.select('.bars').selectAll('.bar').data(_data);
                bar.enter().append('rect');
                bar.exit().remove();
                bar.attr('width', x.rangeBand())
                   .attr('x', function(d) { return x(d.x); })
                   .attr('y', function(d) { return y(d.y); })
                   .attr('height', function(d) { return height - y(d.y); })
                   .classed('bar', true);
                bar.on('mouseenter', function(d) {
                    $rootScope.$broadcast('histogram:hover', d.x);
                }).on('mouseleave', function() {
                    $rootScope.$broadcast('histogram:nohover');
                });

                var tip = d3.tip().html(function(d) {
                    return d3.round(d.y, 2) + '%';
                }).attr({
                    'id' : 'tip-' + attrs.id,
                    'class' : 'd3-tip'
                });

                d3.select($element[0]).select('svg').call(tip);

                $rootScope.$on('histogram:hover', function(event, index) {
                    svg.select('.bars').selectAll('.bar').classed('hover', function(d) {
                        if (d.x === index) {
                            tip.show(d);
                            var _x = $element[0].getBoundingClientRect().left + margin.left;
                            _x += x(d.x);
                            _x -= d3.select('#tip-' + attrs.id)[0][0].getBoundingClientRect().width / 2;
                            _x += x.rangeBand() / 2;

                            var _y = $element[0].getBoundingClientRect().top + margin.top;
                            _y += y(d.y);
                            _y -= d3.select('#tip-' + attrs.id)[0][0].getBoundingClientRect().height;

                            d3.select('#tip-' + attrs.id).style({
                                top : _y + 'px',
                                left : _x + 'px'
                            });
                            return true;
                        }
                        return false;
                    });
                });

                $rootScope.$on('histogram:nohover', function() {
                    tip.hide();
                    svg.select('.bars').selectAll('.bar').classed('hover', false);
                });

                svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0, ' + height + ')').call(xAxis);

                svg.append('g').attr('class', 'texts')
                   .append('text').text($scope.title)
                                  .attr('text-anchor', 'middle')
                                  .attr('x', width / 2)
                                  .attr('transform', 'translate(0, -' + (margin.top / 3) + ')');
            };

            $scope.$watch('data', function() {
                if ($scope.data != null) {
                    refresh();
                }
            });
        }
    };
}]);