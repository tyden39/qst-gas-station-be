require("dotenv").config()
const compression = require("compression")
const express = require("express")
const { default: helmet } = require("helmet")
const morgan = require("morgan")
const sequelize = require("./dbs/init.database")
const app = express()

// middlewares
// app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// db
sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error) => console.error("Unable to connect to the database:", error))

// routes
app.use('/', require('./routes'))

// handling error
app.use((req, res, next) => {
  const error = Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  return res.status(statusCode).json({
    status: statusCode,
    message: error.message || 'Internal Server Error'
  })
})

module.exports = app
