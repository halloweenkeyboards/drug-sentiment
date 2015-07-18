(function() {
    'use strict';

    angular
    .module('app.drugs')
    .directive('drugList', function() {
        return {
            templateUrl: 'app/widgets/drug-list.html',
            restrict: 'E',
            controller: function($scope) {
                var padding = 25;
                var xScale = d3.scale.linear()
                        .domain([-1, 1])
                        .range([0 + padding, $scope.w - padding]);
                $scope.d3Options = {
                    pieRadius: 150,
                    pieW: $scope.w * 1.5,
                    pieH: 335,
                    padding: padding,
                    colorBuffer: 55,
                    colors: {
                        designerDrug: '#19ffbe',
                        plinky: '#ff195b'
                    },
                    newLineY: 18,
                    circleRadius: 10,
                    xScale: xScale,
                    rgbScale: d3.scale.linear()
                        .domain([0, 1])
                        .range([255, 0]),
                    xAxis: d3.svg.axis()
                        .scale(xScale)
                        .orient('bottom')
                        .ticks(3)
                };
            }
        };
    });
})();
