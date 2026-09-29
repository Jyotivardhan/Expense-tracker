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
        const {category , from ,to, page = 1, limit = 20} = req.query;
        const filter = {user: req.userId};

        if(category){
            filter.category = category;
        }
        if(from || to){
            filter.date = {};
            if (from) filter.date.$gte = new Date(from);
            if (to) filter.date.$lte = new Date(to);
        }

        const pageNum = Math.max(1, parseInt(page, 10));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
        const skip = (pageNum - 1) * limitNum;

        const [items, total] = await Promise.all([
            Expense.find(filter)
                .populate('category', 'name color')
                .sort({ date: -1 })
                .skip(skip)
                .limit(limitNum),
            Expense.countDocuments(filter)
        ]);

        res.json({
            items,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum)
        });
    } catch (err) {
        res.status(500).json({ error: err.message })
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

export const summary = async (req,res) =>{
    try {
        const {month, year} = req.query;
        const match = { user: req.userId};

        if(month && year){
            const start = new Date(Date.UTC(Number(year), Number(month)-1, 1));
            const end = new Date(Date.UTC(Number(year), Number(month), 1))
            match.date = { $gte: start, $lt: end};
        }
        const result = await Expense.aggregate([
            {$match : match},
            {
                $group : {
                    _id: '$category',
                    total: {$sum : '$amount'},
                    count: { $sum: 1}
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'category'
                }   
            },
            {$unwind: '$category'},
            {
                $project:{
                    _id: 0,
                    categoryId: '$_id',
                    category: '$category.name',
                    color: '$category.color',
                    total: 1,
                    count: 1
                }
            },
            { $sort : {total: -1}}
        ]);
        const grandTotal = result.reduce((sum,r)=>sum + r.total, 0);
        res.json({
            grandTotal,
            breakdown: result
        })
    } catch (err) {
        res.status(500).json({error : err.message})
    }
}