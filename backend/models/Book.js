const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title : { type : String , required : true },
    author : { type : String , required : true },
    isbn : String,
    genre : String,
    condition : String,
    status : { type : String , default : 'Available' },
    owner  : { type : mongoose.Schema.Types.ObjectId , ref : 'User' , required : true },
    images : [String]
}, {timestamps : true });   

module.exports = mongoose.model('Book' , bookSchema);