var express = require('express');
var router = express.Router();
var Transaction = require('../models/transaction');

router.get('/', (req, res) => {
    res.render("home");
});

router.get('/api/transactions', async (req, res) => {
    try {
        const transaction = await Transaction.find();
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
router.get('/api/transactions/:user', async (req, res) => {
    try {
        const transaction = await Transaction.find({ userId: req.params.userId });
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/api/transactions', async (req, res) => {
    try {
        const transaction = await Transaction.create({
            name: req.body.name,
            type: req.body.type,
            amount: req.body.amount,
            date: req.body.date
        }); 
        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router