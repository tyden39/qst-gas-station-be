const sequelize = require("../dbs/init.database")
const { Model, DataTypes } = require("sequelize")

class Company extends Model {}

Company.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
    },
    taxCode: {
      type: DataTypes.STRING
    },
    token: {
      type: DataTypes.TEXT
    }
  },
  {
    sequelize,
    modelName: "Company",
    tableName: "companies",
    timestamps: true,
    paranoid: true,
  }
)

module.exports = Company
