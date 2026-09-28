import mongoose from "mongoose"

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required : true,
        index:true
    },
    amount:{
        type: Number,
        required: true,
    },
    note:{
        type: String,
        trim: true,
        default: ''
    },
    date:{
        type: Date,
        default: Date.now
    }
}, {timestamps : true});

expenseSchema.index({user: 1, date: -1});

export default mongoose.model('Expense', expenseSchema)
