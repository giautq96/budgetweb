angular.module('reportsModule', ['commonModule'])
  .controller('reportsController', ['$scope', '$window', 'Transactions', function ($scope, $window, Transactions) {
    $scope.transactions = [];
    $scope.hasReport = false; //kiem soat viec hien thi table, chart
    var data_expanse; //gia tri cua expanse de hien thi len chart
    var data_income; //gia tri cua income de hien thi len chart
    var labels; //gia tri label de hien thi label cua chart

    //tao bang va chart de hien thi ket qua truy van
    $scope.generateReport = function () {
      if ($scope.startDate.toISOString() <= $scope.endDate.toISOString()) {

        Transactions.getAllTransactionsInRangeTime($scope.startDate.toISOString(), $scope.endDate.toISOString())
          .then(function (res) {
            $scope.transactions = res.data;
            if ($scope.transactions.length == 0) { //truong hop du lieu tra ve rong
              $scope.hasReport = false;
              $window.alert('Không có dữ liệu trong khoảng thời gian bạn chọn');
            } else { //khac rong
              $scope.hasReport = true; //show table va chart
              $scope.totalExpenses = 0; 
              $scope.totalIncomes = 0;
              var incomeTransactions = []; //array chua cac income
              var expanseTransactions = []; //array chua cac expanse
              for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].type == 'expense') {
                  $scope.totalExpenses += res.data[i].amount;
                  expanseTransactions.push(res.data[i]);
                } else {
                  $scope.totalIncomes += res.data[i].amount;
                  incomeTransactions.push(res.data[i]);
                }
              }
             
              var amountsIncomeByDay = {};  //object de tinh tong income theo ngay
              //tinh tong tien trong ngay va nhom theo ngay
              incomeTransactions.forEach(function (income) {
                var day = moment(income.date).format('YYYY-MM-DD');
                if (!amountsIncomeByDay[day]) {
                  amountsIncomeByDay[day] = 0;
                }
                amountsIncomeByDay[day] += income.amount;  //neu cung ngay thi cong vao
              });
              var sortedIncomeArray = Object.entries(amountsIncomeByDay);  //chuyen sang array de sort 
              sortedIncomeArray.sort(function (a, b) { //  Sort theo ngay tang dan
                var dateA = Date.parse(a[0]); 
                var dateB = Date.parse(b[0]);
                return dateA - dateB;
              });
              amountsIncomeByDay = Object.fromEntries(sortedIncomeArray);  //chuyen nguoc array thanh object

              //tuong tu nhu tren voi expanse
              var amountsExpanseByDay = {}; 
              expanseTransactions.forEach(function (income) {
                var day = moment(income.date).format('YYYY-MM-DD');
                if (!amountsExpanseByDay[day]) {
                  amountsExpanseByDay[day] = 0;
                }
                amountsExpanseByDay[day] += income.amount;
              });
              var sortedExpanseArray = Object.entries(amountsExpanseByDay);
              sortedExpanseArray.sort(function (a, b) {
                var dateA = Date.parse(a[0]);
                var dateB = Date.parse(b[0]);
                return dateA - dateB;
              });
              amountsExpanseByDay = Object.fromEntries(sortedExpanseArray);

              //luu cac gia tri label, expanse, income de hien thi len chart
              var labels_expanse = Object.keys(amountsExpanseByDay);
              var data_expanse = Object.values(amountsExpanseByDay);

              var labels_income = Object.keys(amountsIncomeByDay);
              var data_income = Object.values(amountsIncomeByDay);

              //gop 2 label cua income va expanse thanh label tong, lay nhung gia tri ko trung va sort
              var labels = labels_expanse.concat(labels_income.filter((item) => labels_expanse.indexOf(item) < 0))
              labels.sort(function (a, b) {
                var dateA = Date.parse(a);
                var dateB = Date.parse(b);
                return dateA - dateB;
              });

              //cap nhat nhung gia tri con thieu moi thang income va expense theo label tong
              for (var i = 0; i < labels.length; i++) {
                var label = labels[i];
                var incomeIndex = labels_income.indexOf(label);
                var expenseIndex = labels_expanse.indexOf(label);
                if (incomeIndex === -1) {
                  data_income.splice(i, 0, 0); //thieu thi them gia tri 0 vao
                }
                if (expenseIndex === -1) {
                  data_expanse.splice(i, 0, 0);
                }
              }

              //cap nhat cac gia tri cua chart
              chart.data.labels = labels;
              chart.data.datasets[0].data = data_expanse;
              chart.data.datasets[1].data = data_income;
              chart.update();
            }
          })
          .catch(function (err) {
            console.error(err);
          });
      } else {
        $window.alert('Ngày kết thúc không được lớn hơn ngày bắt đầu. Vui lòng chọn lại!');
      }

    };

    $scope.sortColumn = 'name'; //mac dinh sap xep theo ten
    $scope.reverse = false; //mac dinh sap xep giam dan
    $scope.sortData = function (column) {
      if ($scope.sortColumn == column) {
        $scope.reverse = !$scope.reverse; //neu nhap vao column lan nua thi dao nguoc gia tri tim, dang tang dan => giam, va nguoc lai
      } else {
        $scope.reverse = false; 
      }
      $scope.sortColumn = column;
    }
    $scope.getSortName = function (column) {
      if ($scope.sortColumn == column)
        return $scope.reverse ? 'arrow-up' : 'arrow-down'; //nhap lan nua neu thi thay doi icon mui ten
      return '';
    }

    //tao chart
    var ctx = document.getElementById('incomeAndExpenseChart').getContext('2d');
    var chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Expense',
          data: data_expanse,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }, {
          label: 'Incomes',
          data: data_income,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          xAxes: [{
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }])
