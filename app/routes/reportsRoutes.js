var express = require('express');
var router = express.Router();
var Transaction = require('../models/transaction');
router.get('/reports', (req, res) => {
    res.render("reports");
});

router.get('/api/reportTransactions', async (req, res) => {
    try {
        const start = new Date(req.query.startDate);
        const end = new Date(req.query.endDate);
        const transactions = await Transaction.find({ date: { $gte: start, $lte: end } });
        res.json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
})
module.exports = router