'use strict';

myApp.factory('calculator', ['$log', '$filter', function($log, $filter) {
  var calculator = {};

  calculator.getValues = function(birthday) {
    var biorhythmsData = [];
    var now = new Date();
    var thirtyDays = Date.now() + (86400000 * 30);

    if (!biorhythmsData[0]) {
      for (var x = Date.now(); x < thirtyDays; x += 86400000) {
        var day = new Date(x);
        biorhythmsData.push({date: day, physical: null, emotional: null, intellectual: null});
      }
    }

    function getHowManyLived(birthday) {
      var timeBetw1970AndBirthday = Date.now() - birthday;
      var daysLived = 0;
      var weeksLived = 0;

      if (timeBetw1970AndBirthday < 0) { /* if born before Jan 1 1970 */
        daysLived = Math.floor((Math.abs(timeBetw1970AndBirthday) + Date.now()) / 1000 / 86400);
        weeksLived = Math.floor(daysLived / 7);
      } else {
        daysLived = Math.floor(timeBetw1970AndBirthday / 1000 / 86400);
        weeksLived = Math.floor(daysLived / 7);
      }

      var yearsLived = now.getFullYear() - birthday.getFullYear();
      var monthsCompared = now.getMonth() - birthday.getMonth();
      var datesCompared = now.getDate() - birthday.getDate();

      if (yearsLived > 0 && monthsCompared <= 0 && datesCompared < 0) {
        yearsLived -= 1;
      }

      return {daysLived: daysLived, weeksLived: weeksLived, yearsLived: yearsLived};
    }

    var howManyLived = getHowManyLived(birthday);

    var days = howManyLived.daysLived;

    // prevent bulking values in the array from previous function calls
    calculator.datesForChart = [];
    calculator.physForChart = [];
    calculator.emotForChart = [];
    calculator.intelForChart = [];

    for (var n = 0; n < 30; n++) {
      calculator.datesForChart.push($filter('date')(biorhythmsData[n].date, 'd MMM'));
      var biorhythm = [23, 'physical', 'physForChart', 28, 'emotional', 'emotForChart', 33, 'intellectual', 'intelForChart'];
      for (var k = 0; k < 9; k += 3) {
        biorhythmsData[n][biorhythm[k+1]] = Math.round(Math.sin(2 * Math.PI * (days / biorhythm[k])) * 100);
        calculator[biorhythm[k+2]].push(biorhythmsData[n][biorhythm[k+1]]);
      }
      days += 1;
    }

    return {
      daysLived: howManyLived.daysLived,
      weeksLived: howManyLived.weeksLived,
      yearsLived: howManyLived.yearsLived,
      biorhythmsData: biorhythmsData,
      physForChart: calculator.physForChart,
      emotForChart: calculator.emotForChart,
      intelForChart: calculator.intelForChart,
      datesForChart: calculator.datesForChart
    };
  };

  return calculator;
}]);
