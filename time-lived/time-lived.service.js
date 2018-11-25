'use strict';

myApp.factory('calculateTimeLived', function() {
  return function(birthday) {
    var timeBetw1970AndBirthday = Date.now() - birthday;
    var daysLived = 0;
    var weeksLived = 0;
    var now = new Date();

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

    return {days: daysLived, weeks: weeksLived, years: yearsLived};
  };
});
