const sequelize = require("../dbs/init.database")
const { Model, DataTypes } = require("sequelize")
const User = require("./user.model")
const Store = require("./store.model")

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
      primaryKey: true
    },
    taxCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "SubTax",
    tableName: "sub_taxs",
    timestamps: true,
  }
)

SubTax.hasMany(Store, { foreignKey: "subTaxCode", sourceKey: 'subTaxCode' })
SubTax.belongsTo(User, { foreignKey: "taxCode", targetKey: 'taxCode' })

module.exports = SubTax
