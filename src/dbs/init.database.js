const {
  db: { host, name, user, password },
} = require("../configs/config.server")
const { Sequelize } = require("sequelize")

const sequelize = new Sequelize(name, user, password, {
  host: host,
  dialect: "mysql",
})

module.exports = sequelize
