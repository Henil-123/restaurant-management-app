const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

router.post('/', billController.generateBill);
router.get('/', billController.getAllBills);
router.get('/:id', billController.getBillById);

module.exports = router;
