import mongoose from 'mongoose';

const categoryScehma = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    name:{
        type: String,
        required: true,
        trim: true
    },
    color: {
        type: String,
        default: '#607d8b'
    }
}, {timestamps: true});

categoryScehma.index({ user:1 , name: 1}, {unique: true})

export default mongoose.model('Category', categoryScehma)