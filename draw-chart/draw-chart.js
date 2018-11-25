'use strict';

myApp
  .config(['ChartJsProvider', function(ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
      chartColors: ['#0006ff', '#eaa527', '#ad45ce'],
      responsive: true,
      elements: {
        line: {
          fill: false,
          borderWidth: 2
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
  }]);
