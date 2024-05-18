const sequelize = require("../dbs/init.database")
const { Model, DataTypes } = require("sequelize")
const Store = require("./store.model")

class Invoice extends Model {}

Invoice.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    Store_ID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    Logger_ID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Check_Key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Logger_Time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Pump_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Bill_No: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    Bill_Type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Fuel_Type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Start_Time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    End_Time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Unit_Price: {
      type: DataTypes.DECIMAL(9, 3),
      allowNull: false,
    },
    Quantity: {
      type: DataTypes.DECIMAL(9, 3),
      allowNull: false,
    },
    Total_Price: {
      type: DataTypes.DECIMAL(16, 3),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Invoice",
    tableName: "invoices",
    timestamps: true,
  }
)

Invoice.belongsTo(Store, { foreignKey: "Store_ID", targetKey: 'Store_ID' })
Store.hasMany(Invoice, { foreignKey: "Store_ID", sourceKey: 'Store_ID' })

module.exports = Invoice
