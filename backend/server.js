const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const User = require('./models/User');

dotenv.config()

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("--- MongoDB Connected ---"))
.catch(err => console.log("Error Connecting MongoDB : " , err));

app.use('/api/auth' , authRoutes );
app.use('/api/books' , bookRoutes);

app.get('/api/user/:id' , async (req , res) => {
  try{
    const userID = req.params.id;
    
    const user = await User.findById(userID).populate('booksListed');
    
    if(!user) return res.status(404).json({message : "User Not Found"});
    
    res.json(user);
  }  
  catch(err){
    res.status(500).json({ message : err.message });
  }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT , () => {
    console.log(`Server Running on PORT : ${PORT}`);
});