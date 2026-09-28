import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import Category from "../models/category.js"

const DEFAULT_CATEGORIES = [
    {name: 'Food', color: '#ff5722'},
    {name: 'Transport', color: '#2196f3'},
    {name: 'Bills', color: '#9c27b0'},
    {name: 'Entertainment', color: '#ff9800'},
    {name: 'Shopping', color: '#4caf50'},
    {name: 'Health', color: '#e91e63'},
    {name: 'Other', color: '#607d8b'},

]

const signToken = (userId) =>{
    return jwt.sign(
        {id: userId}, 
        process.env.JWT_SECRET, 
        {expiresIn: process.env.JWT_EXPIRES_IN}
    )
};

export const register = async (req,res) =>{
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({error: "Name , email, and password are required"})
        }
        const existing = await User.findOne({email})
        if(existing){
            return res.status(409).json({error: "Email already registered"})
        }
        const hashedpassword = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password:hashedpassword
        })
        await Category.insertMany(
            DEFAULT_CATEGORIES.map((c) => ({ ...c, user: user._id }))
        );
        
        const token = signToken(user._id) 
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({error: err.message});
    }
}

export const login = async(req,res)=>{
    try {
        const {email , password} = req.body;
        if(!email || !password){
            return res.status(400).json({email : 'Email and password are required'});
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({error : 'Invalid credentials'})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(401).json({error:'Invalid credentials'})
        }
        const token = signToken(user._id)
        res.json({
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        })
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}