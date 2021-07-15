const express = require('express');

const ItemCtrl = require('../controllers/item-ctrl');

const router = express.Router();

// Create
router.post('/item', ItemCtrl.create);
// Read
router.get('/items', ItemCtrl.findAll);
router.get('/item/:id', ItemCtrl.findOne);
router.get('/item/type/:type', ItemCtrl.findAllByType);
router.get('/items/available', ItemCtrl.findAllInStock);
router.get('/items/unavailable', ItemCtrl.findAllOutOfStock);
// Update
router.put('/item/:id', ItemCtrl.update);
// Delete
router.delete('/item/:id', ItemCtrl.delete);

module.exports = router;
