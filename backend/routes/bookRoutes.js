const express = require('express');
const router = express.Router();
const { getBooks , createBook , updateBook , deleteBook} = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getBooks).post(protect , createBook);

router.route('/:id').put(protect , updateBook).delete(protect , deleteBook);

module.exports = router;