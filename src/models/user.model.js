const sequelize = require("../dbs/init.database")
const { Model, DataTypes } = require("sequelize")

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    taxCode: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["active", "inactive"],
      defaultValue: "inactive",
    },
    roles: {
      type: DataTypes.JSON,
      defaultValue: []
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
)

module.exports = User
