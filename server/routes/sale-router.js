const express = require('express');

const SaleCtrl = require('../controllers/sale-ctrl');

const router = express.Router();

// Create
router.post('/sale', SaleCtrl.create);
// Read
router.get('/sales', SaleCtrl.findAll);
router.get('/sale/:id', SaleCtrl.findById);
router.get('/sales/lastReceiptNumber', SaleCtrl.findLastReceiptNumber);
// Update
router.put('/sale/:id', SaleCtrl.update);
// Delete
router.delete('/sale/:id', SaleCtrl.delete);

module.exports = router;
