'use strict';

angular.module('myApp').component('biorhythmsCalc', {
  templateUrl: 'biorhythms-calc/biorhythms-calc.template.html',
  controller: BiorhythmsCalcController
});

function BiorhythmsCalcController($scope, $rootScope, $filter, $timeout, $log, calculator) {
  var $ctrl = this;
  var result = 0;
  $ctrl.birthdayMax = new Date();
  $ctrl.birthdayMin = new Date('Jan 1 1900');
  $ctrl.birthday = null;
  $scope.show = 'not-showed';

  $scope.$on('show', function() {
    if ($scope.show === 'not-showed') {
      $scope.show = 'showed';
    }
  });

  $ctrl.getPDF = function() {
    var doc = new jsPDF('p', 'pt');
    var daArgs = Array.from(calculator.datesForChart);
    var phArgs = Array.from(calculator.physForChart);
    var emArgs = Array.from(calculator.emotForChart);
    var inArgs = Array.from(calculator.intelForChart);

    function makeArr(dates, a, b, c,) {
      var newArr = [];
      var pos = -1;
      while (dates.length > 0) {
        pos += 1;
        newArr.push(dates.splice(0,1));
        newArr[pos].push(a.shift() + '%');
        newArr[pos].push(b.shift() + '%');
        newArr[pos].push(c.shift() + '%');
      }
      return newArr;
    }

    var columns = ['Date', 'Physical', 'Emotional', 'Intellectual'];
    var rows = makeArr(daArgs, phArgs, emArgs, inArgs);
    doc.autoTable(columns, rows);
    var range = document.createRange();
    var canvas = range.startContainer.getElementsByTagName('canvas')[0];
    doc.addPage();
    doc.addImage(canvas, 'PNG', 20, 20, 500, 240, 'no alias', 'NONE', 0);
    // or chart in larger size:
    // doc.addImage(canvas, 'PNG', 120, -400, 700, 450, 'no alias', 'NONE', -90);
    doc.save('yourbiorhythms.pdf');
  };

  $ctrl.getColor = function(num) {
    if (num > 0) {
      return 'positive';
    } else if (num < 0) {
      return 'negative';
    } else {
      return 'nocolor';
    }
  };

  $ctrl.getYourResult = function () {
    $log.log('A user submitted birthday: ', $filter('date')($ctrl.birthday));
    result = calculator.getValues($ctrl.birthday);
    $log.log('result: ', result);
    $ctrl.howManyLived = 'You are ' + result.daysLived + ' days, ' + result.weeksLived + ' weeks, and ' + result.yearsLived + ' years old by now.';
    $ctrl.tableData = result.biorhythmsData;

    function informAboutInput($scope) {
      $scope.$broadcast('check', [result.physForChart, result.emotForChart, result.intelForChart]);
    }

    $timeout(function() {
      informAboutInput($scope);
    }, 100);
  };
}
