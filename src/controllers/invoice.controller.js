"use strict"

const { CREATED, OK } = require("../core/success.response")
const InvoiceService = require("../services/invoice.service")

class InvoiceController {
  importOneInvoice = async (req, res, next) => {
    new CREATED({
      message: "Import an invoice success!",
      data: await InvoiceService.createInvoice(req.body),
    }).send(res)
  }

  getInvoices = async (req, res, next) => {
    new OK({
      message: 'Get invoices success!',
      data: await InvoiceService.findInvoices(req)
    }).send(res)
  }

  exportExcel = async (req, res, next) => {
    const exportInvoices = await InvoiceService.findInvoices(req)

    new OK({
      message: 'Export invoice success!',
      data: await InvoiceService.handleRefreshToken(req.body)
    }).send(res)
  }

  updateInvoice = async (req, res, next) => {
    new OK({
      message: 'Update invoice success!',
      data: await InvoiceService.updateInvoice(req.body)
    }).send(res)
  }
}

module.exports = new InvoiceController()
