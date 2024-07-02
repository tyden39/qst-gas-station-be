const sequelize = require("../dbs/init.database")
const { Model, DataTypes } = require("sequelize")
const Logger = require("./logger.model")

class Invoice extends Model {}

Invoice.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    Logger_ID: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Logger,
        key: "Logger_ID",
      },
      onDelete: 'CASCADE'
    },
    Logger_Time: {
      type: DataTypes.DATE,
    },
    Check_Key: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: {
        name: "unique_check_key",
        msg: "duplicate Check Key",
      },
    },
    Pump_ID: {
      type: DataTypes.INTEGER,
    },
    Bill_No: {
      type: DataTypes.INTEGER,
    },
    Bill_Type: {
      type: DataTypes.INTEGER,
    },
    Fuel_Type: {
      type: DataTypes.STRING,
    },
    Start_Time: {
      type: DataTypes.DATE,
    },
    End_Time: {
      type: DataTypes.DATE,
    },
    Unit_Price: {
      type: DataTypes.DECIMAL(9, 0),
    },
    Quantity: {
      type: DataTypes.DECIMAL(9, 3),
    },
    Total_Price: {
      type: DataTypes.DECIMAL(18, 3),
    },
  },
  {
    sequelize,
    modelName: "Invoice",
    tableName: "invoices",
    paranoid: true,
    timestamps: true,
  }
)

Invoice.belongsTo(Logger, { foreignKey: "Logger_ID", targetKey: 'Logger_ID', onDelete: "CASCADE" })
Logger.hasMany(Invoice, { foreignKey: "Logger_ID", sourceKey: 'Logger_ID', onDelete: "CASCADE"  })

module.exports = Invoice
