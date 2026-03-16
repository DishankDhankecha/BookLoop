const Exchange = require('../models/Exchange');
const Book = require('../models/Book');

const createExchange = async (req, res) => {
    try {
        const { bookId } = req.body;
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.owner.toString() === req.user.id) {
            return res.status(400).json({ message: "You cannot request your own book" });
        }

        const existingRequest = await Exchange.findOne({
            book: bookId,
            requester: req.user.id,
            status: { $in: ['Pending', 'Accepted'] }
        });

        if (existingRequest) {
            return res.status(400).json({ message: "You already have an active request for this book" });
        }

        const exchange = await Exchange.create({
            book: bookId,
            requester: req.user.id,
            owner: book.owner
        });

        res.status(201).json(exchange);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getIncomingRequests = async (req, res) => {
    try {
        const requests = await Exchange.find({ owner: req.user.id })
            .populate('book', 'title author images')
            .populate('requester', 'username location');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getOutgoingRequests = async (req, res) => {
    try {
        const requests = await Exchange.find({ requester: req.user.id })
            .populate('book', 'title author images')
            .populate('owner', 'username location email');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateExchangeStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const exchange = await Exchange.findById(req.params.id);

        if (!exchange) {
            return res.status(404).json({ message: "Exchange request not found" });
        }

        if (exchange.owner.toString() !== req.user.id && exchange.requester.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to update this exchange" });
        }

        exchange.status = status;
        await exchange.save();

        if (status === 'Accepted') {
            await Book.findByIdAndUpdate(exchange.book, { status: 'Pending Exchange' });
        } else if (status === 'Completed') {
            await Book.findByIdAndUpdate(exchange.book, { status: 'Lent Out' });
        } else if (status === 'Declined') {
            await Book.findByIdAndUpdate(exchange.book, { status: 'Available' });
        }

        res.json(exchange);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteExchange = async (req, res) => {
    try {
        const exchange = await Exchange.findById(req.params.id);

        if (!exchange) {
            return res.status(404).json({ message: "Exchange request not found" });
        }

        if (exchange.requester.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to cancel this request" });
        }

        if (exchange.status === 'Accepted') {
            await Book.findByIdAndUpdate(exchange.book, { status: 'Available' });
        }

        await exchange.deleteOne();

        res.status(200).json({ message: "Exchange request cancelled successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createExchange, getIncomingRequests, getOutgoingRequests, updateExchangeStatus, deleteExchange };