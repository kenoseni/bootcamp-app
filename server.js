const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const fileupload = require('express-fileupload')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')

// load env vars
dotenv.config({ path: './config/config.env' })

// Route files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')

// Connect to database
connectDB()

const app = express()

// Body parser
app.use(express.json())

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// File uploading
app.use(fileupload())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)

app.use(errorHandler)

const PORT = process.env.PORT || 4700

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
)

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold)
    // Close server & exit process
    server.close(() => process.exit(1))
})
