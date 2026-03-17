const User = require('../models/User');
const Book = require('../models/Book');
const Exchange = require('../models/Exchange');

const getAdminDashboard = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        const books = await Book.find().populate('owner', 'username email');
        const exchanges = await Exchange.find()
            .populate('book')
            .populate('requester', 'username')
            .populate('owner', 'username');

        res.json({ users, books, exchanges });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        
        await Book.deleteMany({ owner: userId });
        
        await Exchange.deleteMany({ 
            $or: [{ requester: userId }, { owner: userId }] 
        });
        
        await User.findByIdAndDelete(userId);
        
        res.json({ message: 'User and all associated data removed from platform' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAdminDashboard, deleteUser };