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

        $scope.currentProjection = [];
        $scope.currentPage = 1;
        var lastPage = 5;
        $scope.sortPreference = { sortCriteria : 'average', title : 'Average Experience Sentiment' };

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
                $scope.assignProjection(1);
                //$scope.drawD3();
            })
            .error(function(data) {
                console.log('error :' + data);
            });
        };

        $scope.assignProjection = function(page) {
            $scope.currentPage = page;
            $scope.currentProjection = [];
            for (var x = (page * 6) - 6; x < page * 6; ++x) {
                $scope.currentProjection.push($scope.drugs[x]);
            }
        };

        $scope.turnPage = function(direction) {
            if (direction == 'forward' && $scope.currentPage < lastPage) {
                $scope.currentPage += 1;
                $scope.assignProjection($scope.currentPage);
            } else if (direction == 'backward' && $scope.currentPage > 1) {
                $scope.currentPage -= 1;
                $scope.assignProjection($scope.currentPage);
            }
        }

        $scope.sortCollection = function(sortCriteria) {
            if (sortCriteria == 'average') {
                $scope.sortPreference = { sortCriteria : 'average', title : 'Average Experience Sentiment' };
            } else if (sortCriteria == 'experiences') {
                $scope.sortPreference = { sortCriteria : 'experiences', title : 'Number of Experiences' };
            } else if (sortCriteria == 'positive') {
                $scope.sortPreference = { sortCriteria : 'positive', title : '% Positive Experiences' };
            } else if (sortCriteria == 'name') {
                $scope.sortPreference = { sortCriteria : 'name', title : 'Alphabetical' };
            }
            
            $scope.drugs = _.sortBy($scope.drugs, sortCriteria);
            
            if (sortCriteria != 'name') {
                $scope.drugs = $scope.drugs.reverse();
            }
            $scope.assignProjection(1);
        }

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

