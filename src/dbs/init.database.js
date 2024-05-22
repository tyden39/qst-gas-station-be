const {
  db: { host, name, user, password },
} = require("../configs/config.server")
const { Sequelize } = require("sequelize")

const sequelize = new Sequelize(name, user, password, {
  host: host,
  dialect: "mysql",
  pool: {
    max: 16,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: true
})

module.exports = sequelize
