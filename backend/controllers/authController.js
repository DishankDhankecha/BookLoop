const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async ( req , res ) => {
    try{
        const { username , email , password , location } = req.body;
        
        const userExists = await User.findOne({email});

        if(userExists){
            return res.status(400).json({ message : "User Already Exists " });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);

        const user = await User.create({
            username, 
            email,
            password: hashedPassword,
            location
        });

        if(user){
            res.status(201).json({
                _id : user.id,
                username : user.username,
                email : user.email,
                token : generateToken(user.id) 
            });
        }else{
            res.status(400).json({ message : "Invalid User Data"});
        }
    }catch(err){
        console.error("Error : " , err);
        res.status(500).json({ message : err.message });
    }   
}

const loginUser = async (req,res) => {
    try{
        const { email , password } = req.body;

        const user = await User.findOne({email});

        if(user && (await bcrypt.compare(password , user.password))){
            res.json({
                _id : user.id,
                username : user.username,
                email : user.email,
                token : generateToken(user.id) 
            });
        }else{
            res.status(401).json({ message : " Invalid email or password "});
        }
    }catch(err){
        res.status(500).json({ message : err.message });
    }
}

const generateToken = (id) => {
    return jwt.sign( { id } , process.env.JWT_SECRET, {
        expiresIn : '30d',
    });
}

module.exports = {
    registerUser,
    loginUser,
} 