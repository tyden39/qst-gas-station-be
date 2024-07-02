const moment = require("moment")
const Invoice = require("../models/invoice.model")
const {
  BadRequestError,
  ConflictRequestError,
  UnauthorizedError,
} = require("../core/error.response")
const { Op, Sequelize } = require("sequelize")
const { FUEL_TYPE } = require("../constants/invoice/filter")
const Branch = require("../models/branch.model")
const Company = require("../models/company.model")
const Store = require("../models/store.model")
const UserService = require("./user.service")
const { PERMISSION } = require("../constants/auth/permission")
const {
  getCompanyFilter,
  getBranchFilter,
  getStoreFilter,
} = require("../utils/permission")
const { getStoreFilter: getStoreFilterV2 } = require("../utils/permission.v2")
const Logger = require("../models/logger.model")
const { includes } = require("lodash")
const User = require("../models/user.model")

class InvoiceService {
  static async createInvoice(data) {
    const loggerTimeDate = moment(data.Logger_Time, moment.ISO_8601).toDate()
    const startTimeDate = moment(data.Start_Time, moment.ISO_8601).toDate()
    const endTimeDate = moment(data.End_Time, moment.ISO_8601).toDate()
    try {
      const createdInvoice = await Invoice.create({
        ...data,
        Logger_Time: loggerTimeDate,
        Start_Time: startTimeDate,
        End_Time: endTimeDate,
      })
      return createdInvoice
    } catch (error) {
      throw new ConflictRequestError(error.message)
    }
  }

  static async importInvoice(data) {
    const loggerTimeDate = moment(
      data.Logger_Time,
      "DD-MM-YYYY HH:mm:ss"
    ).toDate()
    const startTimeDate = moment(
      data.Start_Time,
      "DD-MM-YYYY HH:mm:ss"
    ).toDate()
    const endTimeDate = moment(data.End_Time, "DD-MM-YYYY HH:mm:ss").toDate()
    try {
      const createdInvoice = await Invoice.create({
        ...data,
        Logger_Time: loggerTimeDate,
        Start_Time: startTimeDate,
        End_Time: endTimeDate,
      })
      return createdInvoice
    } catch (error) {
      throw new ConflictRequestError(error.message)
    }
  }

  static async getInvoiceById({params, keyStore}) {
    const authUser = keyStore
    const isAdmin = authUser.roles[0] === PERMISSION.ADMINISTRATOR
    const { id } = params
    const invoice = await Invoice.findOne({
      where: { id },
      paranoid: !isAdmin,
      attributes: {
        include: [
          [Sequelize.literal("`Logger->Store`.`id`"), "storeId"],
          [Sequelize.literal("`Logger->Store`.`name`"), "storeName"],
          [Sequelize.literal("`Logger->Store->Branch`.`id`"), "branchId"],
          [Sequelize.literal("`Logger->Store->Branch`.`name`"), "branchName"],
          [Sequelize.literal("`Logger->Store->Branch->Company`.`id`"), "companyId"],
          [Sequelize.literal("`Logger->Store->Branch->Company`.`name`"), "companyName"],
        ]
      },
      include: [
        {
          model: Logger,
          attributes: [],
          include: [
            {
              model: Store,
              attributes: [],
              include: [
                {
                  model: Branch,
                  attributes: [],
                  include: [
                    {
                      model: Company,
                      attributes: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    })
    if (!invoice) throw new BadRequestError(`Không tìm thấy hóa đơn mã #${id}!`)
    return invoice
  }

  static async getInvoices({ query, selectAll, keyStore }) {
    const authUser = keyStore
    const isAdmin = authUser.roles[0] === PERMISSION.ADMINISTRATOR

    const {
      keyword,
      startDate,
      endDate,
      companyId,
      branchId,
      storeId,
      Logger_ID,
      sortBy = [["Logger_Time", "DESC"]]
    } = query
    const billType = +query.billType
    const fuelType = +query.fuelType
    const fuelTypeLabel =
      FUEL_TYPE.find((item) => item.id === fuelType)?.label ?? ""
    const pumpId = +query.pumpId
    const pageSize = +query.pageSize
    const page = +query.page
    const offset = (page - 1) * pageSize

    const companyFilter = getCompanyFilter(authUser, companyId)
    const branchFilter = getBranchFilter(authUser, branchId)
    const storeFilter = getStoreFilter(authUser, storeId)
    const loggerFilter = Logger_ID ? { Logger_ID: Logger_ID } : {}

    const keywordFilter = keyword
      ? {
          [Op.or]: [
            { id: { [Op.like]: `%${keyword}%` } },
            { Logger_ID: { [Op.like]: `%${keyword}%` } },
            { Check_Key: { [Op.like]: `%${keyword}%` } },
          ],
        }
      : {}

    const dateFilter =
      startDate && endDate
        ? {
            Logger_Time: {
              [Op.between]: [new Date(startDate), new Date(endDate)],
            },
          }
        : {}

    const billTypeFilter =
      billType >= 0
        ? {
            Bill_Type: billType,
          }
        : {}

    const fuelTypeFilter =
      fuelType >= 0
        ? {
            Fuel_Type: fuelTypeLabel,
          }
        : {}
    const pumpIdFilter =
      pumpId >= 0
        ? {
            Pump_ID: pumpId,
          }
        : {}

    // Combine filters
    const where = {
      ...dateFilter,
      ...keywordFilter,
      ...billTypeFilter,
      ...fuelTypeFilter,
      ...pumpIdFilter,
      ...loggerFilter
    }

    const { count, rows: invoices } = await Invoice.findAndCountAll({
      where,
      paranoid: !isAdmin,
      limit: selectAll ? null : pageSize,
      offset: offset,
      order: [...sortBy],
      attributes: {
        include: [
          [Sequelize.literal("`Logger->Store`.`id`"), "storeId"],
          [Sequelize.literal("`Logger->Store`.`name`"), "storeName"],
          [Sequelize.literal("`Logger->Store->Branch`.`id`"), "branchName"],
          [Sequelize.literal("`Logger->Store->Branch`.`name`"), "branchName"],
          [Sequelize.literal("`Logger->Store->Branch->Company`.`id`"), "companyName"],
          [Sequelize.literal("`Logger->Store->Branch->Company`.`name`"), "companyName"],
        ]
      },
      include: [
        {
          model: Logger,
          attributes: [],
          include: [
            {
              model: Store,
              where: { ...storeFilter },
              attributes: [],
              include: [
                {
                  model: Branch,
                  where: { ...branchFilter },
                  attributes: [],
                  include: [
                    {
                      model: Company,
                      where: { ...companyFilter },
                      attributes: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    })

    const totalPages = Math.ceil(count / pageSize)

    return {
      data: invoices,
      meta: {
        totalItems: count,
        totalPages,
        currentPage: page,
        pageSize: pageSize,
      },
    }
  }

  static async getInvoicesWithIds(ids) {
    return await Invoice.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    })
  }

  static async updateInvoice(id, data) {
    const invoice = await Invoice.findOne({
      where: { Check_Key: id },
      paranoid: false,
    })
    if (!invoice) throw new BadRequestError(`Không tìm thấy hóa đơn mã #${id}!`)
    return await invoice.update(data)
  }

  static async deleteInvoice(id, force) {
    const invoice = await Invoice.findByPk(id, { paranoid: !force })
    if (!invoice) {
      throw new Error(`Không tìm thấy hóa đơn mã #${id}`)
    }
    return await invoice.destroy({ force: Boolean(force) })
  }

  static async restore(id) {
    const invoice = await Invoice.findByPk(id, { paranoid: false })
    if (!invoice) {
      throw new NotFoundError("Không tìm thấy hóa đơn cần khôi phục!")
    }
    await invoice.restore()
  }
}

module.exports = InvoiceService
