"use strict"

const { CREATED, OK } = require("../core/success.response")
const InvoiceService = require("../services/invoice.service")
const excelJS = require("exceljs");
const moment = require("moment")

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
      data: await InvoiceService.getInvoices(req)
    }).send(res)
  }

  getInvoice = async (req, res, next) => {
    new OK({
      message: 'Get invoice success!',
      data: await InvoiceService.getInvoiceById(req.params)
    }).send(res)
  }

  exportExcel = async (req, res, next) => {
    const exportInvoices = await InvoiceService.getInvoices(req)

    const workbook = new excelJS.Workbook(); 
    const worksheet = workbook.addWorksheet("Invoices");

    // Define columns in the worksheet 
    worksheet.columns = [ 
      { header: "Logger_ID", key: "Logger_ID", width: 15 }, 
      { header: "Check_Key", key: "Check_Key", width: 15 }, 
      { header: "Logger_Time", key: "Logger_Time", width: 25 }, 
      { header: "Pump_ID", key: "Pump_ID", width: 10 }, 
      { header: "Bill_No", key: "Bill_No", width: 10 }, 
      { header: "Bill_Type", key: "Bill_Type", width: 10 }, 
      { header: "Fuel_Type", key: "Fuel_Type", width: 10 }, 
      { header: "Start_Time", key: "Start_Time", width: 10 }, 
      { header: "End_Time", key: "End_Time", width: 10 }, 
      { header: "Unit_Price", key: "Unit_Price", width: 10 }, 
      { header: "Quantity", key: "Quantity", width: 10 }, 
      { header: "Total_Price", key: "Total_Price", width: 10 }, 
    ]

    // Add data to the worksheet 
    exportInvoices.forEach(invoice => {
      const invoiceDateFormated = {
        ...invoice.toJSON(),
        Logger_Time: moment(invoice.Logger_Time).format('DD-MM-YYYY HH:mm:ss'),
        Start_Time: moment(invoice.Start_Time).format('DD-MM-YYYY HH:mm:ss'),
        End_Time: moment(invoice.End_Time).format('DD-MM-YYYY HH:mm:ss')
      }
      worksheet.addRow(invoiceDateFormated)
    })

    // Set up the response headers 
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); 
    res.setHeader("Content-Disposition", "attachment; filename=" + "invoices.xlsx");

    // Write the workbook to the response object 
    workbook.xlsx.write(res).then(() => res.end());
  }

  updateInvoice = async (req, res, next) => {
    new OK({
      message: 'Update invoice success!',
      data: await InvoiceService.updateInvoice(req.body)
    }).send(res)
  }
}

module.exports = new InvoiceController()
