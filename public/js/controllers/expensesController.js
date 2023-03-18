angular.module('expensesModule', ['commonModule'])
    .controller('expensesController', ['$scope', '$http', 'Transactions', function ($scope, $http, Transactions) {
        $scope.transactions = [];

        Transactions.getAllExpenseTransactions()
            .success(function (data) {
                $scope.transactions = data;
            })

        $scope.editExpense = function (index) {
            $scope.transactions[index].editing = true;
        };

        $scope.saveExpense = function (index) {
            $scope.transactions[index].editing = false;
            const data = {
                _id: $scope.transactions[index]._id,
                name: $scope.transactions[index].name,
                amount: $scope.transactions[index].amount
            }
            // Gui du lieu toi server de luu thay doi
            Transactions.updateExpanseTransaction(data).then(function (res) {
                $scope.transactions = res;
                console.log("Update successfully");
                location.reload();
            }, function (err) {
                console.log(err);
            })
        };

        $scope.cancelEdit = function (index) {
            $scope.transactions[index].editing = false;
        };

        $scope.deleteTransaction = function (data) {
            $scope.loading = false;
            Transactions.deleteExpanseTransaction(data._id).then(function (res) {
                $scope.transactions = res;
                $scope.loading = false;
                //cap nhat lai trang khi xoa xong
                location.reload();
            }, function (err) {
                console.log(err);
            })
        };
    }])