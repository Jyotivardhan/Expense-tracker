import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import Category from "../models/category.js"
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

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

export const register = asyncHandler(async(req,res) =>{
    try {
        const {name, email, password} = req.body;
        const existing = await User.findOne({email})
        if(existing) throw new ApiError(409, 'Email already registered')
        
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
})

export const login = asyncHandler(async(req,res)=>{
    try {
        const {email , password} = req.body;
        const user = await User.findOne({ email });
        if (!user) throw new ApiError(401, 'Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new ApiError(401, 'Invalid credentials');
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
})