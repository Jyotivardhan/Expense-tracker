import Expense from "../models/Expense.js";

export const createExpense = async (req,res) =>{
    try{
        const {amount, note, date} = req.body;
        const expense = await Expense.create({user: req.userId, amount, note, date});
        res.status(201).json(expense);
    }catch(err){
        res.status(400).json({error : err.message});
    }
};

export const listExpenses = async (req ,res)=>{
    try {
        const expenses = await Expense.find({ user: req.userId }).sort({date : -1})
        res.json(expenses);
    } catch (err) {
        res.status(500).json({error : err.message});
    }
};

export const getExpense = async (req, res) =>{
    try {
        const expense = await Expense.findOne({_id:req.params.id, user:req.userId});
        if(!expense) return res.status(404).json({error: "Expense not found"});
        return res.json(expense);
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

export const updateExpense = async (req,res) =>{
    try {
        const {amount , note, date} = req.body;
        const expense = await Expense.findOneAndUpdate({ _id: req.params.id, user: req.userId } , {amount, note, date}, {new:true, runValidators: true})
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