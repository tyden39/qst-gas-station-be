const moment = require("moment")
const Invoice = require("../models/invoice.model")
const { BadRequestError, ConflictRequestError } = require("../core/error.response")
const { Op } = require("sequelize")
const { FUEL_TYPE } = require("../constants/invoice/filter")

class InvoiceService {
  static async createInvoice(data) {
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
    const { id, storeId } = params
    const invoice = await Invoice.findOne({
      where: { Bill_No: id, Logger_ID: storeId },
    })
    if (!invoice) throw new BadRequestError(`Invoice ID ${id} not found!`)
    return invoice
  }

  static async getInvoices({query}) {
    const { keyword, startDate, endDate } = query
    const billType = +query.billType
    const fuelType = +query.fuelType
    const fuelTypeLabel = FUEL_TYPE.find(item => item.id === fuelType)?.label ?? ''
    const pumpId = +query.pumpId
    const pageSize = +query.pageSize
    const page = +query.page
    const offset = (page - 1) * pageSize
  
    const keywordFilter = keyword ? {
      [Op.or]: [
        { id: { [Op.like]: `%${keyword}%` } },
        { Logger_ID: { [Op.like]: `%${keyword}%` } },
        { Check_Key: { [Op.like]: `%${keyword}%` } },
      ]
    } : {};

    const dateFilter = startDate && endDate ? {
      Logger_Time: {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      }
    } : {};

    const billTypeFilter = billType >= 0 ? {
      Bill_Type: billType
    } : {};

    const fuelTypeFilter = fuelType >= 0 ? {
      Fuel_Type: fuelTypeLabel
    } : {};
    const pumpIdFilter = pumpId >= 0 ? {
      Pump_ID: pumpId
    } : {};
  
    // Combine filters
    const where = {
      ...dateFilter,
      ...keywordFilter,
      ...billTypeFilter,
      ...fuelTypeFilter,
      ...pumpIdFilter,
    };

    const { count, rows: invoices } = await Invoice.findAndCountAll({
      where,
      limit: pageSize,
      offset: offset,
      order: [['Logger_Time', 'DESC']]
    })

    const totalPages = Math.ceil(count / pageSize)

    return {
      data: invoices,
      meta: {
        totalItems: count,
        totalPages,
        currentPage: page,
        pageSize: pageSize
      }
    }
  }

  static async updateInvoice(id, data) {
    const invoice = await Invoice.findByPk(id)
    if (!invoice) {
      throw new Error("Invoice not found")
    }
    return await Invoice.update(data)
  }

  static async deleteInvoice(id) {
    const Invoice = await Invoice.findByPk(id)
    if (!Invoice) {
      throw new Error("Invoice not found")
    }
    return await Invoice.destroy()
  }
}

module.exports = InvoiceService
