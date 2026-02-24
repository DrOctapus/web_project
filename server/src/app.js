const express = require('express')
const cors = require('cors')
const path = require('path')
const { connectDB } = require('./config/db')
require('dotenv').config()

connectDB()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

app.use('/img', express.static(path.join(__dirname, '/img')))

// Routes
const bookRoutes = require('./routes/books.routes')
const courseRoutes = require('./routes/courses.routes')
const categoryRoutes = require('./routes/category.routes')
const authRoutes = require('./routes/auth.routes')

// Mount routes
app.use('/api/books', bookRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/auth', authRoutes)

// Error Handler Middleware
const errorHandler = require('./middleware/errorHandler')
app.use(errorHandler)

// Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})