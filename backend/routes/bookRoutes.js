const express = require('express');
const router = express.Router();
const { getBooks, createBook, updateBook, deleteBook, getPublicBooks, getBookById, getPendingBooks, reviewBook } = require('../controllers/bookController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/public').get(getPublicBooks);

router.route('/admin/pending').get(protect, admin, getPendingBooks);
router.route('/admin/review/:id').patch(protect, admin, reviewBook);

router.route('/').get(getBooks).post(protect, createBook);
router.route('/:id').get(protect, getBookById);
router.route('/:id').put(protect, updateBook).delete(protect, deleteBook);

module.exports = router;