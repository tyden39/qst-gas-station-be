const sequelize = require("../dbs/init.database")
const { DataTypes, Model } = require("sequelize")

class ApiKey extends Model {}

ApiKey.init(
  {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      default: true,
    },
    permissions: {
      type: DataTypes.STRING,
      allowNull: false,
      enum: ["0000", "1111", "2222"],
    },
  },
  {
    sequelize,
    modelName: "ApiKey",
    tableName: "apikeys",
    timestamps: true,
  }
)

module.exports = ApiKey
