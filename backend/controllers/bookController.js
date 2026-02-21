const Book = require('../models/Book');

const getBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('owner', 'username location');
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const createBook = async (req, res) => {
    try {
        const { title, author, isbn, genre, condition } = req.body;

        const book = new Book({
            title,
            author,
            isbn,
            genre,
            condition,
            owner: req.user._id
        })

        const createdBook = await book.save();
        res.status(201).json(createdBook);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: "User is not authorised to update this book" });
        }

        const updateBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updateBook);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found " });
        }

        if (book.owner.toString() !== req.params.id) {
            return res.status(401).json({ message: "User is not authorised to delete this book" });
        }

        await book.deleteOne();
        res.status(500).json({ message: "Book Removed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { getBooks, createBook , updateBook, deleteBook }; 