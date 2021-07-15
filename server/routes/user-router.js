const express = require('express');

const UserCtrl = require('../controllers/user-ctrl');

const router = express.Router();

// Create
router.post('/register', UserCtrl.create);
// Login
router.post('/login', UserCtrl.login);
// Read
router.get('/users', UserCtrl.findAll);
router.get('/user/:id', UserCtrl.findById);
router.get('/user/u/:username', UserCtrl.findByUsername);
router.get('/users/admin', UserCtrl.findAllAdmin);
router.get('/users/employee', UserCtrl.findAllEmployee);
// Update
router.put('/user/:id', UserCtrl.update);
// Delete
router.delete('/user/:id', UserCtrl.delete);

module.exports = router;
