const sequelize = require("../dbs/init.database")
const { Model, DataTypes } = require("sequelize")

class KeyToken extends Model {}

KeyToken.init(
  {
    user: {
      type: DataTypes.UUID,
      allowNull: false
    },
    roles: {
      type: DataTypes.JSON,
    },
    storeId: {
      type: DataTypes.UUID,
    },
    branchId: {
      type: DataTypes.UUID,
    },
    companyId: {
      type: DataTypes.UUID,
    },
    accessToken: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    refreshTokenUsed: {
      type: DataTypes.JSON,
      defaultValue: []
    },
  },
  {
    sequelize,
    modelName: "TokenKey",
    tableName: "tokenkeys",
    timestamps: true,
  }
)

module.exports = KeyToken
