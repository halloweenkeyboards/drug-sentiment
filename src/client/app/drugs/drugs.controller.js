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

