const moment = require("moment")
const Invoice = require("../models/invoice.model")
const {
  BadRequestError,
  ConflictRequestError,
} = require("../core/error.response")
const { Op } = require("sequelize")
const { FUEL_TYPE } = require("../constants/invoice/filter")
const Branch = require("../models/branch.model")
const Company = require("../models/company.model")
const Store = require("../models/store.model")
const UserService = require("./user.service")

class InvoiceService {
  static async createInvoice(data) {
    try {
      return await Invoice.create(data)
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

  static async getInvoiceById(params) {
    const { id } = params
    const invoice = await Invoice.findOne({
      where: { Check_Key: id },
    })
    if (!invoice) throw new BadRequestError(`Không tìm thấy hóa đơn mã #${id}!`)
    return invoice
  }

  static async getInvoices({ query, selectAll, keyStore }) {
    const authUser = (await UserService.getUserById(keyStore.user)).toJSON()

    const { keyword, startDate, endDate, companyId, branchId, storeId } = query
    const billType = +query.billType
    const fuelType = +query.fuelType
    const fuelTypeLabel =
      FUEL_TYPE.find((item) => item.id === fuelType)?.label ?? ""
    const pumpId = +query.pumpId
    const pageSize = +query.pageSize
    const page = +query.page
    const offset = (page - 1) * pageSize

    const companyFilter = authUser.companyId && ['000', '001', ]
      ? { companyId: authUser.companyId }
      : companyId
      ? { companyId: companyId }
      : {}

    const branchFilter = authUser.branchId
      ? { branchId: authUser.branchId }
      : branchId
      ? { branchId: branchId }
      : {}

    const storeFilter = authUser.storeId
      ? { storeId: authUser.storeId }
      : storeId
      ? { storeId: storeId }
      : {}

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
      ...companyFilter,
      ...branchFilter,
      ...storeFilter,
    }

    const { count, rows: invoices } = await Invoice.findAndCountAll({
      where,
      limit: selectAll ? null : pageSize,
      offset: offset,
      order: [["Logger_Time", "DESC"]],
      include: [Store, Branch, Company],
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
    const invoice = await this.getInvoiceById({ id })
    return await invoice.update(data)
  }

  static async deleteInvoice(id) {
    const invoice = await Invoice.findByPk(id)
    if (!invoice) {
      throw new Error(`Không tìm thấy hóa đơn mã #${id}`)
    }
    return await invoice.destroy()
  }
}

module.exports = InvoiceService
