const sequelize = require("../dbs/init.database")
const { DataTypes } = require("sequelize")

const ApiKey = sequelize.define(
  "Apikey",
  {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      allowNull: false,
      enum: ["0000", "1111", "2222"],
    },
  },
  {
    timestamps: true,
    tableName: "Apikeys",
  }
)

module.exports = ApiKey
