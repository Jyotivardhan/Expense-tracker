import Category from '../models/category.js'
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listCategories = asyncHandler(async(req,res) => {
    const categories = await Category.find({ user: req.userId }).sort({ name: 1 });
    res.json(categories);
});

export const createCategory = asyncHandler(async(req,res)=>{
  const { name, color } = req.body;

  const category = await Category.create({
    user: req.userId,
    name,
    color
  });

  res.status(201).json(category);
})

export const updateCategory = async(req, res)=>{
  const { name, color } = req.body;

  const update = {};
  if (name !== undefined) update.name = name;
  if (color !== undefined) update.color = color;

  const category = await Category.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    update,
    { new: true, runValidators: true }
  );

  if (!category) throw new ApiError(404, 'Category not found');

  res.json(category);
}

export const deleteCategory = async (req, res) => {
  const category = await Category.findOneAndDelete({
    _id: req.params.id,
    user: req.userId
  });

  if (!category) throw new ApiError(404, 'Category not found');

  res.status(204).send();
};