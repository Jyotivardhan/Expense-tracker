import Expense from "../models/Expense.js";
import Category from '../models/category.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createExpense = asyncHandler(async (req,res) =>{
  const { category, amount, note, date } = req.body;

  const validCategory = await Category.findOne({
    _id: category,
    user: req.userId
  });

  if (!validCategory) throw new ApiError(400, 'Invalid category');

  const expense = await Expense.create({
    user: req.userId,
    category,
    amount,
    note,
    date
  });

  await expense.populate('category', 'name color');

  res.status(201).json(expense);
});

export const listExpenses = asyncHandler(async (req ,res)=>{
  const { category, from, to, page, limit } = req.validatedQuery;

  const filter = { user: req.userId };

  if (category) filter.category = category;

  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = from;
    if (to) filter.date.$lte = to;
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Expense.find(filter)
      .populate('category', 'name color')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit),
    Expense.countDocuments(filter)
  ]);

  res.json({
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  });
});

export const summary = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  const match = { user: req.userId };

  if (month && year) {
    const start = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
    const end = new Date(Date.UTC(Number(year), Number(month), 1));
    match.date = { $gte: start, $lt: end };
  }

  const result = await Expense.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
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
    { $unwind: '$category' },
    {
      $project: {
        _id: 0,
        categoryId: '$_id',
        category: '$category.name',
        color: '$category.color',
        total: 1,
        count: 1
      }
    },
    { $sort: { total: -1 } }
  ]);

  const grandTotal = result.reduce((sum, r) => sum + r.total, 0);

  res.json({
    grandTotal,
    breakdown: result
  });
});

export const getExpense = asyncHandler(async (req, res) =>{
  const expense = await Expense.findOne({
    _id: req.params.id,
    user: req.userId
  }).populate('category', 'name color');

  if (!expense) throw new ApiError(404, 'Expense not found');

  res.json(expense);
})

export const updateExpense = asyncHandler(async (req,res) =>{
  const { category, amount, note, date } = req.body;

  if (category) {
    const validCategory = await Category.findOne({
      _id: category,
      user: req.userId
    });
    if (!validCategory) throw new ApiError(400, 'Invalid category');
  }

  const update = {};
  if (category !== undefined) update.category = category;
  if (amount !== undefined) update.amount = amount;
  if (note !== undefined) update.note = note;
  if (date !== undefined) update.date = date;

  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    update,
    { new: true, runValidators: true }
  ).populate('category', 'name color');

  if (!expense) throw new ApiError(404, 'Expense not found');

  res.json(expense);
});

export const deleteExpense = async (req, res)=>{
  const expense = await Expense.findOneAndDelete({
    _id: req.params.id,
    user: req.userId
  });

  if (!expense) throw new ApiError(404, 'Expense not found');

  res.status(204).send();
}

