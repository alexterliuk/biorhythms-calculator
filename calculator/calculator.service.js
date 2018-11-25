'use strict';

myApp.factory('calculateBiorhythms', function() {
  return function(days) {
    var biorhythmsData = [];
    var thirtyDays = Date.now() + (86400000 * 30);

    for (var x = Date.now(); x < thirtyDays; x += 86400000) {
      biorhythmsData.push({
        date: new Date(x),
        physical:  calcBioFormula(days, 23),
        emotional: calcBioFormula(days, 28),
        intellectual: calcBioFormula(days, 33)
      });
      days++;
    }

    return biorhythmsData;
  };

  function calcBioFormula(days, period) {
    return Math.round(Math.sin(2 * Math.PI * (days / period)) * 100);
  }
});
