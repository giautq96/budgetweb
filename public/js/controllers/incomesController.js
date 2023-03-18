angular.module('incomesModule', ['commonModule'])
    .controller('incomesController', ['$scope', 'Transactions', function ($scope, Transactions) {
        $scope.transactions = [];

        Transactions.getAllIncomeTransactions()
            .success(function (data) {
                $scope.transactions = data;
            });

        $scope.editIncome = function (index) {
            $scope.transactions[index].editing = true;
        };

        $scope.saveIncome = function (index) {
            $scope.transactions[index].editing = false;
            const data = {
                _id: $scope.transactions[index]._id,
                name: $scope.transactions[index].name,
                amount: $scope.transactions[index].amount
            }
            //Goi ham ben service de goi api phia server
            Transactions.updateIncomeTransaction(data).then(function (res) {
                $scope.transactions = res;
                //cap nhat lai trang
                location.reload();
            }, function (err) {
                console.log(err);
            })
        };

        $scope.cancelEdit = function (index) {
            $scope.transactions[index].editing = false;
        };

        $scope.deleteTransaction = function (data) {
            Transactions.deleteIncomeTransaction(data._id).then(function (res) {
                $scope.transactions = res;
                //cap nhat trang
                location.reload();
            }, function (err) {
                console.log(err);
            })
        }
    }])

