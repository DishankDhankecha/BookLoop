const express = require('express');
const router = express.Router();
const {
    createExchange,
    getIncomingRequests,
    getOutgoingRequests,
    updateExchangeStatus,
    deleteExchange
} = require('../controllers/exchangeController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createExchange);
router.get('/incoming', protect, getIncomingRequests);
router.get('/outgoing', protect, getOutgoingRequests);
router.put('/:id', protect, updateExchangeStatus);
router.delete('/:id', protect, deleteExchange);

module.exports = router;