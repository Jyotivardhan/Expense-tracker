import mongoose from "mongoose"

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
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
}, {timestamps : true})

export default mongoose.model('Expense', expenseSchema)
