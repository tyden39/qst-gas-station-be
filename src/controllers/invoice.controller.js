"use strict"

const { BILL_TYPES } = require("../constants/invoice/filter")
const { CREATED, OK } = require("../core/success.response")
const InvoiceService = require("../services/invoice.service")
const excelJS = require("exceljs")
const moment = require("moment")

class InvoiceController {
  importOneInvoice = async (req, res, next) => {
    new CREATED({
      message: "Import an invoice success!",
      data: await InvoiceService.importInvoice(req.body),
    }).send(res)
  }

  getInvoices = async (req, res, next) => {
    new OK({
      message: "Get invoices success!",
      data: await InvoiceService.getInvoices(req),
    }).send(res)
  }

  getInvoice = async (req, res, next) => {
    new OK({
      message: "Get invoice success!",
      data: await InvoiceService.getInvoiceById(req.params),
    }).send(res)
  }

  exportExcel = async (req, res, next) => {
    const ids = req.query.ids ? req.query.ids.split(',') : []

    let exportInvoices = []
    if (ids.length > 0) {
      exportInvoices = await InvoiceService.getInvoicesWithIds(ids)
    } else {
      const { data: invoicesWithFilter } = await InvoiceService.getInvoices({
        query: req.query,
        selectAll: true,
      })
      exportInvoices = invoicesWithFilter
    }

    const workbook = new excelJS.Workbook()
    const worksheet = workbook.addWorksheet("Invoices")

    // Define columns in the worksheet
    worksheet.columns = [
      { header: "STT", key: "order", width: 10 },
      { header: "Mã Kiểm Tra", key: "Check_Key", width: 25 },
      { header: "Mã Logger", key: "Logger_ID", width: 15 },
      { header: "Thời Gian Ghi Log", key: "Logger_Time", width: 20 },
      { header: "Mã Vòi Bơm", key: "Pump_ID", width: 10 },
      { header: "Mã Hóa Đơn", key: "Bill_No", width: 10 },
      { header: "Loại Hóa đơn", key: "Bill_Type", width: 10 },
      { header: "Loại Nhiên Liệu", key: "Fuel_Type", width: 30 },
      { header: "Thời Gian Bắt Đầu Bơm", key: "Start_Time", width: 20 },
      { header: "Thời Gian Kết Thúc Bơm", key: "End_Time", width: 20 },
      { header: "Giá", key: "Unit_Price", width: 10 },
      { header: "Số Lượng", key: "Quantity", width: 10 },
      { header: "Tổng Tiền", key: "Total_Price", width: 20 },
    ]

    // Add data to the worksheet
    exportInvoices.forEach((invoice, index, array) => {
      const invoiceDateFormated = {
        ...invoice.toJSON(),
        order: array.length - index,
        Bill_Type: BILL_TYPES.find(item => item.value === invoice.Bill_Type).label || '',
        Logger_Time: moment(invoice.Logger_Time).format("DD-MM-YYYY HH:mm:ss"),
        Start_Time: moment(invoice.Start_Time).format("DD-MM-YYYY HH:mm:ss"),
        End_Time: moment(invoice.End_Time).format("DD-MM-YYYY HH:mm:ss"),
      }
      worksheet.addRow(invoiceDateFormated)
    })

    // Set up the response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "invoices.xlsx"
    )

    // Write the workbook to the response object
    workbook.xlsx.write(res).then(() => res.end())
  }

  updateInvoice = async (req, res, next) => {
    new OK({
      message: "Update invoice success!",
      data: await InvoiceService.updateInvoice(req.params.id, req.body),
    }).send(res)
  }

  deleteInvoice = async (req, res, next) => {
    new OK({
      message: 'Delete invoice success!',
      data: await InvoiceService.deleteInvoice(req.params.id)
    }).send(res)
  }
}

module.exports = new InvoiceController()
