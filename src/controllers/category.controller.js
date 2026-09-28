import Category from '../models/category.js'
import Expense from '../models/Expense.js'

export const listCategories = async(req,res) =>{
    try{
        const categories = await Category.find({user: req.userId}).sort({name: 1});
        res.json(categories);
    }catch(err){
        res.status(500).json({error : err.message})
    }
};

export const createCategory = async(req,res)=>{
    try{
        const {name,color} = req.body
        if(!name){
            return res.status(400).json({error: 'Name is required'})
        }
        const category = await Category.create({
            user: req.userId,
            name,
            color
        })
        res.status(201).json(category)
    }catch(err){
        if(err.code === 11000){
            return res.status(409).json({error: ' Category with this name already exists'})
        }
        res.status(400).json({error: err.message})
    }
}

export const updateCategory = async(req, res)=>{
    try {
        const {name , color} = req.body;
        const category = awaitnCategory.findOneAndUpdate(
            {_id: req.params.id , user: req.userId},
            {name,color},
            {new:true , runValidators: true}

        )
        if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Category with this name already exists' });
        }
        res.status(400).json({ error: err.message });
    }
}

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};