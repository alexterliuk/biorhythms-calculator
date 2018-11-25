'use strict';

angular.module('myApp').component('biorhythmsCalc', {
  templateUrl: 'biorhythms-calc/biorhythms-calc.template.html',
  controller: BiorhythmsCalc,
  controllerAs: 'bc'
});

function BiorhythmsCalc($scope, $filter, $log, calculateBiorhythms, calculateTimeLived) {
  var bc = this;
  $scope.$watch('bc.birthday', watchBirthday, true);

  function watchBirthday (newBirthday, oldBirthday) {
    if (newBirthday) {
      bc.getYourResult(newBirthday);
      $log.log('newBirthday: ', newBirthday);
      $log.log('oldBirthday: ', oldBirthday);
    }
  }

  bc.birthday = null;
  bc.birthdayMax = new Date();
  bc.birthdayMin = new Date('Jan 1 1900');

  bc.getPDF = function() {
    if (!bc.birthday) {
      return;
    }
    var doc = new jsPDF('p', 'pt');
    var daArgs = bc.labels;
    var phArgs = bc.data[0];
    var emArgs = bc.data[1];
    var inArgs = bc.data[2];

    function makeArr(dates, a, b, c) {
      var newArr = [];
      for (var y = 0; y < dates.length; y++) {
        newArr.push([]);
        newArr[y].push(dates[y]);
        newArr[y].push(a[y] + '%');
        newArr[y].push(b[y] + '%');
        newArr[y].push(c[y] + '%');
      }
      return newArr;
    }

    var columns = ['Date', 'Physical', 'Emotional', 'Intellectual'];
    var rows = makeArr(daArgs, phArgs, emArgs, inArgs);
    // doc.text('Biorhythms cycles record on the given birthday: ' + $filter('date')(bc.birthday, 'dd.MM.yyyy'), 40, 750, {});
    // doc.text('Today: ' + $filter('date')(bc.birthdayMax, 'dd.MM.yyyy'), 40, 780, {});
    doc.autoTable(columns, rows);

    var canvas = document.getElementsByTagName('canvas')[0];

    doc.addPage();
    doc.addImage(canvas, 'PNG', 20, 20, 500, 240, 'no alias', 'NONE', 0);
    // or chart in larger size:
    // doc.addImage(canvas, 'PNG', 120, -400, 700, 450, 'no alias', 'NONE', -90);
    doc.save('yourbiorhythms.pdf');
  };

  bc.getColor = function(num) {
    if (num > 0) {
      return 'positive';
    } else if (num < 0) {
      return 'negative';
    } else {
      return 'nocolor';
    }
  };

  bc.getYourResult = function (birthday) {
    if (!bc.birthday) {
      return;
    }
    bc.lived = calculateTimeLived(birthday);
    $log.log('lived: ', bc.lived);
    bc.tableData = calculateBiorhythms(bc.lived.days);
    $log.log('biorhythms: ', bc.tableData);

    var bioForChart = convertForChart(bc.tableData);

    function convertForChart(bior) {
      var chartVals = [[], [], [], []];
      var keys = Object.keys(bior[0]);

      for (var obj = 0; obj < bior.length; obj++) {
        for (var num = 0; num < chartVals.length; num++) {
          chartVals[num].push(!num ? $filter('date')(bior[obj][keys[num]], 'd MMM') : bior[obj][keys[num]]);
        }
      }

      return {
        data: [chartVals[1], chartVals[2], chartVals[3]],
        labels: chartVals[0],
        series: ['Physical', 'Emotional', 'Intellectual']
      };
    }

    bc.data = bioForChart.data;
    bc.labels = bioForChart.labels;
    bc.series = bioForChart.series;
  };
}
