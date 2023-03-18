var express = require('express');
var router = express.Router();
var Transaction = require('../models/transaction');

router.get('/expenses', (req, res) => {
    res.render("expenses");
});


async function getAllExpenseTransactions(res) {
    try {
        const transaction = await Transaction.find({ type: 'expense' });
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

router.get('/api/expenseTransactions', async (req, res) => {
    getAllExpenseTransactions(res);
});

router.delete('/api/expanseTransactions/:id', async (req, res) => {
    try {
        const transaction = await Transaction.remove({ _id: req.params.id });
        //cap nhat cac expense de hien thi gia tri moi nhat
        getAllExpenseTransactions(res);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/api/expanseTransactions/', async (req, res) => {
    try {
        const transaction = await Transaction.updateOne({
            _id: req.body._id
        },
            {
                name: req.body.name,
                amount: req.body.amount
            });
         //cap nhat cac expense de hien thi gia tri moi nhat
        getAllExpenseTransactions(res);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = router