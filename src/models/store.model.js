const sequelize = require("../dbs/init.database")
const { Model, DataTypes } = require("sequelize")
const Branch = require("./branch.model")
const Company = require("./company.model")

class Store extends Model {}

Store.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
    },
    branchId: {
      type: DataTypes.UUID,
      references: {
        model: Branch,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Store",
    tableName: "stores",
    timestamps: true,
  }
)

Store.belongsTo(Branch, { foreignKey: "branchId", onDelete: "SET NULL" })
Branch.hasMany(Store, { foreignKey: "branchId", onDelete: "SET NULL" })

module.exports = Store
