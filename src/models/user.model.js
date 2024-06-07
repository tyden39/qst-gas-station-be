const sequelize = require("../dbs/init.database")
const { Model, DataTypes } = require("sequelize")
const Branch = require("./branch.model")
const Company = require("./company.model")
const Store = require("./store.model")

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["active", "inactive"],
      defaultValue: "inactive",
    },
    roles: {
      type: DataTypes.JSON,
    },
    storeId: {
      type: DataTypes.UUID,
      references: {
        model: Store,
        key: "id",
      },
    },
    branchId: {
      type: DataTypes.UUID,
      references: {
        model: Branch,
        key: "id",
      },
    },
    companyId: {
      type: DataTypes.UUID,
      references: {
        model: Company,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
)

User.belongsTo(Company, { foreignKey: "companyId", onDelete: "SET NULL" })
Company.hasMany(User, { foreignKey: "companyId" })
User.belongsTo(Branch, { foreignKey: "branchId", onDelete: "SET NULL" })
Branch.hasMany(User, { foreignKey: "branchId" })
User.belongsTo(Store, { foreignKey: "storeId", onDelete: "SET NULL" })
Store.hasMany(User, { foreignKey: "storeId" })

module.exports = User
