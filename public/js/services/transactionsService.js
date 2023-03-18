//tao 1 service dung chung cho cac controller de goi cac api phia server
angular.module('commonModule',[])
.factory('Transactions', ['$http', function($http) {
    return {
        getAllTransactions: function() {
            return $http.get('/api/transactions');
        },
        addOneTransaction: function(data) {
           return $http.post('/api/transactions', data);
        },
        getAllIncomeTransactions: function() {
            return $http.get('/api/incomeTransactions');
        },
        getAllExpenseTransactions: function() {
            return $http.get('/api/expenseTransactions');
        },
        deleteIncomeTransaction: function(id) {
            return $http.delete('/api/incomeTransactions/' + id);
        },
        deleteExpanseTransaction: function(id) {
            return $http.delete('/api/expanseTransactions/' + id);
        },
        updateExpanseTransaction: function(data) {
            return $http.put('/api/expanseTransactions/', data);
        },
        updateIncomeTransaction: function(data) {
            return $http.put('/api/incomeTransactions/', data);
        },
        getAllTransactionsInRangeTime: function(startDate, endDate) {
            return $http.get('/api/reportTransactions', {params: {startDate, endDate}});
        }
         
    }
    
}]);