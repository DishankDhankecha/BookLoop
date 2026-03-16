const express = require('express');
const router = express.Router();
const { getBooks , createBook , updateBook , deleteBook, getPublicBooks, getBookById} = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getBooks).post(protect , createBook);
router.route('/public').get(getPublicBooks);
router.route('/:id').get(protect, getBookById);
router.route('/:id').put(protect , updateBook).delete(protect , deleteBook);

module.exports = router;