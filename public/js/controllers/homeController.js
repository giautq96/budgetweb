angular.module('homeModule', ['commonModule'])
    .controller('homeController', ['$scope', 'Transactions', function ($scope, Transactions) {
        $scope.expense = {};
        $scope.addExpense = function () {
            if ($scope.expense.name != undefined && $scope.expense.amount != undefined && $scope.expense.date != undefined) {
                const data = {
                    name: $scope.expense.name,
                    type: "expense",
                    amount: $scope.expense.amount,
                    date: $scope.expense.date
                }
                Transactions.addOneTransaction(data).then(function (res) {
                    //sau khi them xong thi reset bien expense, xoa du lieu da nhap
                    $scope.expense = {};
                }, function (err) {
                    console.log(err);
                })
            }
        }

        $scope.income = {};
        $scope.addIncome = function () {
            if ($scope.income.name != undefined && $scope.income.amount != undefined && $scope.income.date != undefined) {
                const data = {
                    name: $scope.income.name,
                    type: "income",
                    amount: $scope.income.amount,
                    date: $scope.income.date
                }
                Transactions.addOneTransaction(data).then(function (res) {
                     //sau khi them xong thi reset bien expense, xoa du lieu da nhap
                    $scope.income = {};
                }, function (err) {
                    console.log(err);
                })
            }
        }
    }])