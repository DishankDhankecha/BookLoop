const express = require('express');
const router = express.Router();
const {registerUser , loginUser, bulkRegister } = require('../controllers/authController');

router.post('/register' , registerUser);
router.post('/login' , loginUser);
router.post('/bulk' , bulkRegister);

module.exports = router;