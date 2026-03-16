const Book = require('../models/Book');
const Exchange = require('../models/Exchange');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const getUserProfile = async (req, res) => {
    try {
        const userID = req.params.id;
        const user = await User.findById(userID).select('-password').populate('booksListed');
        
        if (!user) return res.status(404).json({ message: "User Not Found" });
        
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const userID = req.params.id;
        const { username, email, location, avatar, preferences } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            userID,
            { username, email, location, avatar, preferences },
            { new: true }
        ).select('-password');
        
        if (!updatedUser) return res.status(404).json({ message: "User Not Found" });
        
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateUserPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid current password" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getGlobalStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const bookCount = await Book.countDocuments();
        const exchangeCount = await Exchange.countDocuments({ status: 'Completed' });

        res.json({
            users: userCount,
            books: bookCount,
            exchanges: exchangeCount
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getUserProfile, updateUserProfile, updateUserPassword, getGlobalStats };