const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: [150, 'Name cannot be more than 150 characters']
    }
})

module.exports = mongoose.model('Category', categorySchema)