const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: [true, 'Please add a first name'],
        maxlength: [100, 'First name cannot be more than 100 characters']
    },
    lname: {
        type: String,
        required: [true, 'Please add a last name'],
        maxlength: [100, 'Last name cannot be more than 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        select: false,
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
            'Invalid password'
        ]
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Please add date of birth']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    skillLevel: {
        type: Number,
        default: 1,
        min: [1, 'Range is 1-3'],
        max: [3, 'Range is 1-3']
    },
    categoriesInterested: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }]
})

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    // Only run this function if password was modified (not on other updates)
    if (!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', userSchema)