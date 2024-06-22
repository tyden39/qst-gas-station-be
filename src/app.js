require("dotenv").config()
const compression = require("compression")
const express = require("express")
const { default: helmet } = require("helmet")
// const morgan = require("morgan")
const sequelize = require("./dbs/init.database")
const cors = require("cors")
const initialData = require("./dbs/init.data")
const configServer = require("./configs/config.server")
const app = express()

// middlewares
// app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// db
const dbSyncForce = true
sequelize
  .sync({ force: dbSyncForce })
  .then(async () => {
    console.log("Connection has been established successfully.")

    if (dbSyncForce) await initialData()
  })
  .catch((error) => console.error("Unable to connect to the database:", error))

const corsOptions = {
  origin: configServer.app.corsOrigin,
  // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  // credentials: true, // Enable CORS for cookies, authorization headers, etc.
  // optionsSuccessStatus: 204, // Some legacy browsers choke on 204
}

app.use(cors(corsOptions))

// routes
app.use("/", require("./routes"))

// handling error
app.use((req, res, next) => {
  const error = Error("Not Found")
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  return res.status(statusCode).json({
    status: statusCode,
    message: error.message || "Internal Server Error",
  })
})

module.exports = app
