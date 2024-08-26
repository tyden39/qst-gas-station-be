const moment = require("moment")
const Invoice = require("../models/invoice.model")
const {
  BadRequestError,
  ConflictRequestError,
  UnauthorizedError,
  NotFoundError,
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
const Logger = require("../models/logger.model")
const { includes } = require("lodash")
const User = require("../models/user.model")
const LoggerService = require("./logger.service")
const { authenticationCompany } = require("../auth/authUtils")

class InvoiceService {
  static async createInvoice(data) {
    const {companyId, storeId, branchId} = data
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
      return {...createdInvoice.toJSON(), companyId, storeId, branchId}
    } catch (error) {
      throw new ConflictRequestError(error.message)
    }
  }

  static async importInvoice(req) {
    const data = req.body
    const authCompany = await authenticationCompany(req)
    const logger = (
      await LoggerService.findByPropertyName({
        force: true,
        propName: "Logger_ID",
        value: data.Logger_ID,
      })
    )?.toJSON()

    if (!logger)
      throw new BadRequestError(`Không tìm thấy Logger_ID #${data.Logger_ID}`)
    if (logger.companyId !== authCompany.id)
      throw new BadRequestError(
        `Logger_ID ${logger.Logger_ID} không tồn tại trong công ty ${authCompany.name}`
      )

    const loggerTimeDate = moment(
      data.Logger_Time,
      "DD-MM-YYYY HH:mm:ss"
    )
    const startTimeDate = moment(
      data.Start_Time,
      "DD-MM-YYYY HH:mm:ss",
      true
    )

    const endTimeDate = moment(data.End_Time, "DD-MM-YYYY HH:mm:ss")

    if (loggerTimeDate.isValid()) {
      throw new BadRequestError('Logger_Time: Sai format json')
    }

    if (startTimeDate.isValid()) {
      throw new BadRequestError('Start_Time: Sai format json')
    }

    if (endTimeDate.isValid()) {
      throw new BadRequestError('End_Time: Sai format json')
    }

    try {
      const createdInvoice = await Invoice.create({
        ...data,
        Logger_Time: loggerTimeDate.toDate(),
        Start_Time: startTimeDate.toDate(),
        End_Time: endTimeDate.toDate(),
      })
      return createdInvoice
    } catch (error) {
      throw new BadRequestError(error.message)
    }
  }

  static async getInvoiceById({ params, keyStore }) {
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
          [
            Sequelize.literal("`Logger->Store->Branch->Company`.`id`"),
            "companyId",
          ],
          [
            Sequelize.literal("`Logger->Store->Branch->Company`.`name`"),
            "companyName",
          ],
        ],
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
      sortBy,
    } = query

    const sortByFilter =
      sortBy && sortBy.lenght > 0 ? JSON.parse(sortBy) : [["createdAt", "DESC"]]

    const billType = +query.billType
    const fuelType = query.fuelType
    const fuelTypeLabel = fuelType ?? ""
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
      fuelType
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
    }

    const { count, rows: invoices } = await Invoice.findAndCountAll({
      where,
      paranoid: !isAdmin,
      limit: selectAll ? null : pageSize,
      offset: offset,
      order: [...sortByFilter],
      attributes: {
        include: [
          [Sequelize.literal("`Logger->Store`.`id`"), "storeId"],
          [Sequelize.literal("`Logger->Store`.`name`"), "storeName"],
          [Sequelize.literal("`Logger->Store->Branch`.`id`"), "branchName"],
          [Sequelize.literal("`Logger->Store->Branch`.`name`"), "branchName"],
          [
            Sequelize.literal("`Logger->Store->Branch->Company`.`id`"),
            "companyName",
          ],
          [
            Sequelize.literal("`Logger->Store->Branch->Company`.`name`"),
            "companyName",
          ],
        ],
      },
      include: [
        {
          model: Logger,
          attributes: [],
          where: { ...loggerFilter },
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

  static async getInvoicesWithIds(selected, unselected) {
    const idFilter =
      unselected.length > 0
        ? {
            [Op.notIn]: unselected,
          }
        : {
            [Op.in]: selected,
          }

    return await Invoice.findAll({
      where: {
        id: idFilter,
      },
    })
  }

  static async updateInvoice(id, data) {
    const invoice = await Invoice.findOne({
      where: { id },
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

  static async deleteBulk(query) {
    const selected = query.selected
      ? query.selected === "all"
        ? []
        : query.selected
      : []
    const unselected = query.unselected ? query.unselected : []
    const idFilter =
      unselected.length > 0
        ? {
            [Op.notIn]: unselected,
          }
        : {
            [Op.in]: selected,
          }

    await Invoice.destroy({
      where:
        query.selected === "all"
          ? {}
          : {
              id: idFilter,
            },
      force: Boolean(query.force),
    })
  }

  static async restoreBulk(query) {
    const selected = query.selected
      ? query.selected === "all"
        ? []
        : query.selected
      : []
    const unselected = query.unselected ? query.unselected : []
    const idFilter =
      unselected.length > 0
        ? {
            [Op.notIn]: unselected,
          }
        : {
            [Op.in]: selected,
          }

    await Invoice.restore({
      where:
        query.selected === "all"
          ? {}
          : {
              id: idFilter,
            },
    })
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
