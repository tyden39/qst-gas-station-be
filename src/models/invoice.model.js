const sequelize = require("../dbs/init.database")
const { Model, DataTypes } = require("sequelize")
const Store = require("./store.model")

class Invoice extends Model {}

Invoice.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    Pump_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Logger_ID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Check_Key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'unique_check_key',
        msg: 'duplicate Check Key'
    }
    },
    Bill_Type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Logger_Time: {
      type: DataTypes.DATE,
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
      type: DataTypes.DECIMAL(9, 0),
      allowNull: false,
    },
    Quantity: {
      type: DataTypes.DECIMAL(9, 3),
      allowNull: false,
    },
    Total_Price: {
      type: DataTypes.DECIMAL(18, 3),
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

// Invoice.belongsTo(Store, {foreignKey: 'Logger_ID'})
// Store.hasMany(Invoice, {foreignKey: 'Logger_ID'})

module.exports = Invoice
