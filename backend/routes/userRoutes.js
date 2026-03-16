const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, updateUserPassword, getGlobalStats } = require('../controllers/userController');

router.route('/:id').get(getUserProfile).put(updateUserProfile);
router.route('/:id/password').put(updateUserPassword);
router.get('/stats/global', getGlobalStats);

module.exports = router;