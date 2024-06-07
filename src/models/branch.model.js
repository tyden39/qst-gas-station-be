const sequelize = require("../dbs/init.database")
const { Model, DataTypes } = require("sequelize");
const Company = require("./company.model");

class Branch extends Model {}

Branch.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
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
    subTaxCode: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    companyId: {
      type: DataTypes.UUID,
      references: {
          model: Company,
          key: 'id'
      }
  }
  },
  {
    sequelize,
    modelName: "Branch",
    tableName: "branches",
    timestamps: true,
  }
)

Branch.belongsTo(Company, { foreignKey: 'companyId', targetKey: 'id', onDelete: "SET NULL" });
Company.hasMany(Branch, { foreignKey: 'companyId', sourceKey: 'id', onDelete: "SET NULL" });

module.exports = Branch
