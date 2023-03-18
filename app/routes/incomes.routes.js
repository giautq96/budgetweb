var express = require('express');
var router = express.Router();
var Transaction = require('../models/transaction');

router.get('/incomes', (req, res) => {
    res.render("incomes");
});

async function getAllIncomeTransactions(res) {
    try {
        const transaction = await Transaction.find({ type: 'income' });
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

router.get('/api/incomeTransactions', async (req, res) => {
    getAllIncomeTransactions(res);
});

router.delete('/api/incomeTransactions/:id', async (req, res) => {
    try {
        const transaction = await Transaction.remove({ _id: req.params.id });
        getAllIncomeTransactions(res); //cap nhat gia tri moi nhat de hien thi
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/api/incomeTransactions/', async (req, res) => {
    try {
        const transaction = await Transaction.updateOne({
            _id: req.body._id
        },
            {
                name: req.body.name,
                amount: req.body.amount
            });
        getAllIncomeTransactions(res); //cap nhat du lieu de hien thi
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router