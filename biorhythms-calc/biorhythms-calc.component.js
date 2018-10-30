'use strict';

angular.module('myApp').component('biorhythmsCalc', {
  templateUrl: 'biorhythms-calc/biorhythms-calc.template.html',
  controller: BiorhythmsCalcController
});

function BiorhythmsCalcController($scope, $filter) {

  // Alias which allows copy-pasting between template and controller without changing 'this' to '$ctrl' and vice versa
  var $ctrl = this;
  $ctrl.birthdayMax = new Date();
  $ctrl.birthday = null;

  function countDaysBetweenDates(date1, date2) {
    return Math.ceil(Math.abs(date2 - date1) / 1000 / 86400); // with current day
    // return Math.floor(Math.abs(date2 - date1) / 1000 / 86400); // without current day
  }

  $ctrl.yourResult = function () { /* 2nd func is called; contains all other functions */
    // TODO: you don't need to convert Date to string, you can operate with Date type directly and finally convert to string
    var bDay = $filter('date')($ctrl.birthday, 'yyyy-MM-dd');
    console.log('A user provided birthday: ', bDay);
    // TODO: Why now is equal to birthdayMax? If I decide to change birthdayMax above, it will change now.
    var now = $filter('date')($ctrl.birthdayMax, 'yyyy-MM-dd');
    console.log('now: ', now);

    // var rows = [null]; // TODO: why [null]? This means array with one null value. Do you really need it?
    // var daysLived = null;
    // var weeksLived = null;

    // TODO: you have similar names for variables and functions: daysLived vs yearsLived. When you need to use one of them,
    // TODO: how do you know should you call function or use variable? Function name should contain verb in name.
    function yearsLived (b, n) {
      // b - birthday, n - now
      function nums(arr) {
        var split = arr.split('-');
        var newArr = [null];
        split.forEach(function(el){ newArr.push(Number(el)) });
        newArr.shift();
        return newArr;
      }
      var datesAsNums = [nums(b), nums(n)];
      var BD = datesAsNums[0]; /* birthday */
      var NW = datesAsNums[1]; /* now */
      var BDpassed = true; // TODO: what does BDpassed mean? Bad name for variable.
      var years = NW[0] - BD[0];
      console.log('BDpassed: ' + BDpassed);
      console.log('years a person has lived: ' + years);

      compareDates: if (NW[0] - BD[0] !== 0) {
        // compare months
        if (NW[1] - BD[1] < 0) {
          BDpassed = false;
          // stop if current year's month (e.g. Apr) is less than birthday month (e.g. Oct);
          // i.e. this year the person hasn't yet updated his age
          break compareDates;
        } else if (NW[1] - BD[1] > 0) {
          break compareDates;
        } else {
          // in case if months coincide check days, BDpassed at the moment is true
          if (NW[2] - BD[2] < 0) {
            BDpassed = false;
            console.log('BDpassed compareDays console calling: ' + BDpassed);
          }
        }
      }

      console.log('BDpassed: ' + BDpassed);

      if (BDpassed === false) {
        years = years - 1;
      }

      console.log('years AFTER CORRECTION: ' + years);

      return years;
    }

    function calculateBiorhythms (daysLived) {
      var rows = [];

      var daysNowAndTillEnd = currentMonthDaysLeft();
      console.log('daysNowAndTillEnd: ' + daysNowAndTillEnd[0] + ' and ' + daysNowAndTillEnd[1]);

      function getMonthAndYear() {
        var a = $filter('date')($ctrl.birthdayMax, 'MMM-yyyy');
        return ' ' + a.replace(/-/g, ' ');
      }

      function stringifyVals () {
        for (var y = 0; y < rows.length; y++) {
          for (var x = 1; x < 6; x += 2) {
            rows[y][x] = (rows[y][x] * 100).toFixed(1) + '%';
            //make zero be a single digit (and colourless in insertValsInArr)
            if (rows[y][x] === '0.0%' || rows[y][x] === '-0.0%') {
              rows[y][x] = 0;
            }
          }
        }
      }

      function insertValsInArr (bior, num) {
        // TODO: never write such code, hard to understand and hard to debug, 2 problems:
        // TODO: 1. ternary conditional operator should not be used instead of if
        // TODO: 2. operator && should not be used without assignment or condition
        bior === 0 ? rows[num].push(bior) && rows[num].push('nocolor') :
          bior > 0 ? rows[num].push(bior) && rows[num].push('green') :
            rows[num].push(bior) && rows[num].push('red');

        // TODO: correct version of the code
        // if(bior === 0) {
        //   rows[num].push(bior);
        //   rows[num].push('nocolor');
        // } else if(bior > 0) {
        //   rows[num].push(bior);
        //   rows[num].push('green');
        // } else {
        //   rows[num].push(bior);
        //   rows[num].push('red');
        // }
      }

      for (var i = 0; i < daysNowAndTillEnd[1]; i++) {

        rows[i] = [daysNowAndTillEnd[0].toString().concat(getMonthAndYear())];

        var phys = Number(Math.sin(2 * Math.PI * (daysLived - 1) / 23).toFixed(4));
        insertValsInArr(phys, i);

        var emot = Number(Math.sin(2 * Math.PI * (daysLived - 1) / 28).toFixed(4));
        insertValsInArr(emot, i);

        var intel = Number(Math.sin(2 * Math.PI * (daysLived - 1) / 33).toFixed(4));
        insertValsInArr(intel, i);

        daysLived = Number(daysLived);
        daysLived += 1;
        daysNowAndTillEnd[0] += 1;
      }

      stringifyVals();
      console.log('data for table rows: ', rows);

      return rows;
    } /* [END] of calculateBiorhythms */

    function currentMonthDaysLeft() {
      var a = new Date();
      var today = '' + a.getFullYear() + '-' + (a.getMonth() + 1) + '-' + a.getDate();
      var day = Number(today.slice(8));
      var keepToday = Number(today.slice(8));

      do {
        day += 1;
        today = today.slice(0, 8).concat(day);
      } while (typeof Date.parse(today) === "number" && isNaN(Date.parse(today)) !== true);
      // returns today's date and days left to the end of the current month (including curr.day; gives q of rows for table)
      return [keepToday, day - keepToday];
    }

    var daysLived = countDaysBetweenDates(new Date(), $ctrl.birthday);
    var weeksLived = Math.floor(daysLived / 7);

    $ctrl.dataForDay = calculateBiorhythms(daysLived);

    $ctrl.howManyLived = {
      days: ['You are', daysLived - 1, 'days, '], /* current day is added to sum of days */
      weeks: [weeksLived, ' weeks, and '],
      years: [yearsLived(bDay, now), ' years old by now.']
    };

  }; /* [END] of yourResult */

}
