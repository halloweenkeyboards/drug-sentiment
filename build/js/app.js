(function() {

    'use strict';

    angular.module('app', [
        /* Shared modules */
        'app.drugs'
    ]);

})();

(function() {
    'use strict';

    angular
        .module('app.drugs', []);

})();

(function() {
    'use strict';

    angular
    .module('app.drugs')
    .controller('Drugs', Drugs);

    Drugs.$inject = ['$scope', '$http'];

    function Drugs($scope, $http) {
        $scope.title = 'the final report on drug experience sentiment';
        $scope.drugs = [];
        $scope.w = $('.container-fluid').width();
        $scope.h = $('.container-fluid').height();

        angular.element(document).ready(function() {
            $scope.getDrugs();
            d3.select(window).on('resize', resize);
        });

        function resize() {
            console.log('screen resizd');
            console.log('screen width: ' + $('.drug-report').width() + ' pixels');
        }

        $scope.getDrugs = function() {
            $http.get('/api/drugs')
            .success(function(data) {
                var minimumExps = 75;
                var culledData = [];
                _.each(data, function(doc) {
                    if (doc.experiences.length >= minimumExps) {
                        culledData.push(doc);
                    }
                });
                $scope.drugs = culledData;
                //$scope.drawD3();
            })
            .error(function(data) {
                console.log('error :' + data);
            });
        };

        $scope.meetsMinimum = function(drug) {
            var minimum = 50;
            if (drug.experiences.length >= minimum) {
                return true;
            } else {
                return false;
            }
        };
    }
})();


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

(function() {
    'use strict';

    angular
    .module('app.drugs')
    .directive('drugReport', function() {
        return {
            templateUrl: 'app/widgets/drug-report.html',
            restrict: 'E',
            controller: function($scope, $timeout) {
                $scope.w = $('.drug-report').width()-$scope.d3Options.padding;
                $scope.h = $('.drug-report').height();

                $scope.drugRender = function(drug) {

                    /**
                    var highestExp = _.max(drug.experiences, function(exp) { return Number(exp.score); }).score;
                    var lowestExp = _.min(drug.experiences, function(exp) { return Number(exp.score); }).score;
                    **/
                    $timeout(function() {
                        var pieData = [
                            {
                                label: 'positive',
                                value: drug.positive
                            },
                            {
                                label: 'negative',
                                value: (100 - drug.positive)
                            }
                        ];

                        var svg = d3.select('.drug-report#' + drug.cssId + ' svg');
                        var reportElement = document.getElementById(drug.cssId);

                        if (drug.name === '2C-I') {
                            //console.log('I found two cee e');
                            //reportElement.style.backgroundColor = '#ffffff';
                            var svgs = document.getElementsByClassName('bg-pattern');
                            var urls = new Array();
                            for (var i=0; i<svgs.length; i++) {
                                var d = document.createElement('div');
                                d.appendChild(svgs[i].cloneNode(true));
                                var b64 = 'data:image/svg+xml;base64,' + window.btoa(d.innerHTML);
                                urls.push('url("' + b64 + '")');
                            }
                            var url = urls.join(',');
                            reportElement.style.backgroundImage = url;
                        }

                        // add group to svg for pie chart
                        var pieG = svg.append('g')
                            .attr('transform', 'translate(' + ($scope.d3Options.pieW / 2) + ',' + ($scope.d3Options.pieH / 2) + ')');

                        // define arc
                        var arc = d3.svg.arc()
                            .outerRadius($scope.d3Options.pieRadius);

                        // define pie
                        var pie = d3.layout.pie()
                            .value(function(d) { return d.value; });

                        // bind pie to data and define attrs
                        var path = pieG.selectAll('path')
                            .data(pie(pieData))
                            .enter()
                            .append('path')
                            .attr('d', arc)
                            .attr('fill', function(d) {
                                if (d.data.label === 'positive') {
                                    return 'blue';
                                } else {
                                    return 'red';
                                }
                            });

                        // text - percent of positive experiences
                        svg.append('text')
                            .attr('x', ($scope.w / 3) * 2)
                            .attr('y', $scope.d3Options.newLineY * 6)
                            .attr('fill', 'white')
                            .text(drug.positive + '% positive');

                        // append d3 axis
                        svg.append('g')
                            .attr('class', 'axis')
                            .attr('transform', 'translate(0,' + ($scope.h - ($scope.d3Options.padding * 2)) + ')')
                            .call($scope.d3Options.xAxis);

                        // text - drug name text
                        svg.append('text')
                            .attr('x', 15)
                            .attr('y', $scope.d3Options.newLineY * 2)
                            .attr('font-size', 30)
                            .attr('textLength', function() {
                                if ($scope.w >= 400) {
                                    if (drug.name.length <= 5) {
                                        return $scope.w / 5;
                                    } else if (drug.name.length > 5 && drug.name.length <= 12) {
                                        return ($scope.w / 5) * 2;
                                    } else {
                                        return $scope.w / 2;
                                    }
                                } else {
                                    return $scope.w - $scope.d3Options.padding;
                                }
                            })
                            .attr('fill', function() {
                                if (drug.name === 'DMT') {
                                    return 'black';
                                } else if (drug.name === 'MDMA') {
                                    return '#07566b';
                                } else {
                                    return $scope.d3Options.colors.plinky;
                                }
                            })
                            .attr('font-weight', 'bold')
                            .text(drug.name);

                        // text - number of experiences
                        svg.append('text')
                            .attr('x', 15)
                            .attr('y', $scope.d3Options.newLineY * 5)
                            .text(drug.experiences.length + ' experiences');

                        // text - average sentiment score
                        svg.append('text')
                            .attr('x', 15)
                            .attr('y', $scope.d3Options.newLineY * 12)
                            .attr('font-size', 90)
                            .attr('fill', 'white')
                            .text(drug.average.toFixed(3));

                        //tooltips
                        var tip = d3.tip().attr('class', 'd3-tip')
                            .offset([-10, 0])
                            .html(function(d) {return d.title + "<br />" + d.score});

                        svg.call(tip);

                        // bind circles to drug experience data
                        var circles = svg.selectAll('circle')
                            .data(drug.experiences)
                            .enter()
                            .append('circle');

                        // circles - main attrs
                        circles
                            .attr('cx', function(d) {
                                return $scope.d3Options.xScale(d.score);
                            })
                            .attr('cy', ($scope.h - ($scope.d3Options.padding * 2)) - ($scope.d3Options.circleRadius * 2))
                            .attr('r', $scope.d3Options.circleRadius)
                            .attr('fill', function(d) {
                                if (d.score > 0) {
                                    var blueValue = $scope.d3Options.rgbScale(d.score);
                                    return d3.rgb(blueValue, blueValue - $scope.d3Options.colorBuffer, 255);
                                } else if (d.score < 0) {
                                    var redValue = $scope.d3Options.rgbScale(Math.abs(d.score));
                                    return d3.rgb(255, redValue - $scope.d3Options.colorBuffer, redValue);
                                } else {
                                    return 'yellow';
                                }
                            })
                            .on('mouseover', tip.show)
                            .on('mouseout', tip.hide);
                            /**
                            .attr('stroke', function(d) {
                                if (d.score === lowestExp) {
                                    return 'green'
                                } else if (d.score === highestExp) {
                                    return 'yellow'
                                } else {
                                    return 'none';
                                }
                            })
    
                            .append('svg:title')
                            .text(function(d) {
                                return d.title + '\nsentiment: ' + d.score + '\nexperience ID: ' + d.number;
                            });
**/
                    }, 1000);

                };
            }
        };
    });
})();

angular.module("app").run(["$templateCache", function($templateCache) {$templateCache.put("app/widgets/drug-list.html","<div ng-repeat=\"drug in drugs\" class=drug-report ng-attr-id={{drug.cssId}} data-stellar-background-ratio=0.5><drug-report></drug-report></div>");
$templateCache.put("app/widgets/drug-report.html","<svg ng-attr-width={{w}} ng-attr-height={{h}} ng-init=drugRender(drug)></svg>");}]);