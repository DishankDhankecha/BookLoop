const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    location: {
        city: String,
        state: String,
        coordinates: { lat: Number, lng: Number }
    },
    preferences: [String],
    booksListed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);