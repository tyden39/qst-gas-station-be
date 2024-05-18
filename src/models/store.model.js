const sequelize = require("../dbs/init.database")
const { Model, DataTypes } = require("sequelize")
const SubTax = require("./subtax.model")

class Store extends Model {}

Store.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    Store_ID: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subTaxCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Store",
    tableName: "stores",
    timestamps: true,
  }
)

Store.belongsTo(SubTax, { foreignKey: "subTaxCode", targetKey: 'subTaxCode' })

module.exports = Store
