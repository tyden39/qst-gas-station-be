const sequelize = require("../dbs/init.database")
const { Model, DataTypes } = require("sequelize")
const User = require("./user.model")

class SubTax extends Model {}

SubTax.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    subTaxCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  },
  {
    sequelize,
    modelName: "SubTax",
    tableName: "subtaxs",
    timestamps: true,
  }
)

User.hasMany(SubTax)
SubTax.belongsTo(User)

module.exports = SubTax
