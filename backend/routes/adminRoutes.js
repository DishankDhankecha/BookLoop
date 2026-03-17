const express = require('express');
const router = express.Router();
const { getAdminDashboard, deleteUser } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/dashboard').get(protect, admin, getAdminDashboard);
router.route('/users/:id').delete(protect, admin, deleteUser);

module.exports = router;