const sequelize = require("../dbs/init.database")
const { Model, DataTypes } = require("sequelize")
const Store = require("./store.model")

class Logger extends Model {}

Logger.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    Logger_ID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    storeId: {
      type: DataTypes.UUID,
      references: {
        model: Store,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Logger",
    tableName: "loggers",
    paranoid: true,
    timestamps: true,
  }
)

Logger.belongsTo(Store, { foreignKey: "storeId", onDelete: "CASCADE" })
Store.hasMany(Logger, { foreignKey: "storeId", onDelete: "CASCADE" })

module.exports = Logger
