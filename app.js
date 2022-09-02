const { application } = require('express')
const express = require('express')
const morgan = require('morgan')
const tourRouter = require('./routes/tourRouter')
const userRouter = require('./routes/userRouter')

const app = express()

app.use(morgan('dev'))
app.use(express.static(`${__dirname}/public/`))

app.use(express.json()) // middleware for express
// modified the incoming request

// Use more middlewares
app.use((req, res, next) => {
    console.log("This middleware is inside the express middleware stack");
    next();
})

app.use((req, res, next) => {
    req.timeRequest = new Date().toISOString();
    next();
})


//Another way to routes

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
// Start Server
module.exports = app


