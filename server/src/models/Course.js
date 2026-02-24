const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a course title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please add a category'],
    },
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    instructor: {
        type: String,
        required: [true, 'Please add an instructor'],
        maxlength: [100, 'Instructor name cannot be more than 100 characters']
    },
    duration: {
        type: Number, //in weeks
        required: [true, 'Please add a duration (in weeks)'],
        min: [1, 'Duration cannot be negative or zero']
    },
    difficulty: {
        type: Number,
        default: 2,
        min: [1, 'Range is 1-3'],
        max: [3, 'Range is 1-3']
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('Course', courseSchema)