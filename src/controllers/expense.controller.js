import Expense from "../models/Expense.js";
import Category from '../models/category.js'

export const createExpense = async (req,res) =>{
    try{
        const {category, amount, note, date} = req.body;

        if(!category){
            return res.status(400).json({error:'Category is required'})
        }

        const validCategory = await Category.findOne({
            _id: category,
            user: req.userId
        })
        if(!validCategory){
            return res.status(400).json({error: 'Invalid category'})
        }

        const expense = await Expense.create({user: req.userId, category, amount, note, date});

        res.status(201).json(expense);
    }catch(err){
        res.status(400).json({error : err.message});
    }
};

export const listExpenses = async (req ,res)=>{
    try {
        const expenses = await Expense.find({ user: req.userId }).populate('category', 'name color').sort({date : -1})
        res.json(expenses);
    } catch (err) {
        res.status(500).json({error : err.message});
    }
};

export const getExpense = async (req, res) =>{
    try {
        const expense = await Expense.findOne({_id:req.params.id, user:req.userId}).populate('category', 'name color');
        if(!expense) return res.status(404).json({error: "Expense not found"});
        return res.json(expense);
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

export const updateExpense = async (req,res) =>{
    try {
        const {category, amount , note, date} = req.body;

        if(category){
            const validCategory = await Category.findOne({
                _id: category,
                user: req.userId
            });
            if(!validCategory){
                return res.status(400).json({error: 'Invalid category'})
            }
        }
        const update = {};
        if (category !== undefined) update.category = category;
        if (amount !== undefined) update.amount = amount;
        if (note !== undefined) update.note = note;
        if (date !== undefined) update.date = date;



        const expense = await Expense.findOneAndUpdate({ _id: req.params.id, user: req.userId } , update, {new:true, runValidators: true}.populate('category' , 'name color'))
        if(!expense) return res.status(404).json({error : "Expense not found"})
        res.json(expense);
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

export const deleteExpense = async (req, res)=>{
    try{
        const expense = await Expense.findOneAndDelete({_id: req.params.id, user: req.userId});
        if(!expense) return res.status(404).json({error: 'Expense not found'});
        res.status(204).send();
    }catch(err){
        res.status(400).json({error: err.message});
    }
}