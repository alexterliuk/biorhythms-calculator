'use strict';

myApp
  .config(['ChartJsProvider', function(ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
      chartColors: ['#0006ff', '#eaa527', '#ad45ce'],
      responsive: true,
      title: {
        display: true,
        text: 'A physical biorhythm cycle lasts 23 days, emotional - 28, intellectual - 33.',
        fontStyle: 'bold',
        fontSize: 20,
        fontColor: '#222',
        padding: 30
      },
      elements: {
        line: {
          fill: false,
          tension: 0.1,
          borderWidth: 2,
          borderJoinStyle: 'round',
          capBezierPoints: true
        },
        point: {
          radius: 3,
          hoverRadius: 4,
          pointStyle: 'circle'
        }
      }
    });
    // Configure all line charts
    ChartJsProvider.setOptions('line', {
      showLines: true
    });
  }])
  .controller("LineCtrl", ['$scope', '$log', '$timeout', '$filter', 'calculator', function ($scope, $log, $timeout, $filter, calculator) {

    $scope.series = ['Physical', 'Emotional', 'Intellectual'];
    $scope.data = [];
    $scope.labels = [];

    $scope.$on('check', function() {
      $scope.data = [
        calculator.physForChart,
        calculator.emotForChart,
        calculator.intelForChart
      ];
      $scope.labels = calculator.datesForChart;
      $scope.$emit('show');
    });

    $scope.onClick = function(points, evt) {
      console.log(points, evt);
    };
  }]);
