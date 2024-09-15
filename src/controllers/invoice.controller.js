"use strict"

const { BILL_TYPES, FUEL_TYPE } = require("../constants/invoice/filter")
const { CREATED, OK } = require("../core/success.response")
const InvoiceService = require("../services/invoice.service")
const excelJS = require("exceljs")
const moment = require("moment")
const { formatNumber } = require("../utils/number")

class InvoiceController {
  importOneInvoice = async (req, res, next) => {
    new CREATED({
      message: "Import an invoice success!",
      data: await InvoiceService.importInvoice(req),
    }).send(res)
  }

  createInvoice = async (req, res, next) => {
    new CREATED({
      message: "Create an invoice success!",
      data: await InvoiceService.createInvoice(req.body, req.keyStore),
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
      data: await InvoiceService.getInvoiceById(req),
    }).send(res)
  }

  exportExcel = async (req, res, next) => {
    const selected = req.query.selected ? req.query.selected === 'all' ? [] : req.query.selected.split(',') : []
    const unselected = req.query.unselected ? req.query.unselected.split(',') : []

    let exportInvoices = []
    if (selected.length > 0 || unselected.length > 0) {
      exportInvoices = await InvoiceService.getInvoicesWithIds(selected, unselected)
    } else {
      const { data: invoicesWithFilter } = await InvoiceService.getInvoices({
        query: req.query,
        selectAll: true,
        keyStore: req.keyStore
      })
      exportInvoices = invoicesWithFilter
    }

    const workbook = new excelJS.Workbook()
    const worksheet = workbook.addWorksheet("Invoices")

    // Define columns in the worksheet
    worksheet.columns = [
      { header: "Số thứ tự hóa đơn (*)", key: "order",  },
      { header: "Ngày hóa đơn", key: "Logger_Time",  },
      { header: "Tên khách hàng", key: "customerName" },
      { header: "Địa chỉ", key: "address" },
      { header: "Mã số thuế", key: "taxNumber" },
      { header: "Người mua hàng", key: "buyer", values: '' },
      { header: "Email", key: "email" },
      { header: "Tiền thuế GTGT", key: "tax",  },
      { header: "Hình thức thanh toán", key: "paymentType" },
      { header: "Thuế suất GTGT (%)", key: "taxPercent", },
      { header: "Tên hàng hóa/dịch vụ (*)", key: "Fuel_Type" },
      { header: "ĐVT", key: "unit",  },
      { header: "Số Lượng", key: "Quantity", width: 10 },
      { header: "Giá", key: "Unit_Price", width: 10 },
      { header: "Tổng Tiền", key: "Total_Price", width: 10 },
    ]

    worksheet.columns.forEach(column => {
      let maxLength = column.width;
      column.eachCell({ includeEmpty: true }, cell => {
          const columnLength = cell.value ? cell.value.toString().length : 0;
          maxLength = Math.max(maxLength, columnLength);
      });
  
      column.width = maxLength + 2;
      
      switch (column.key) {
        case 'order':
        case 'unit':
        case 'taxPercent':
        case 'Quantity':
          column.alignment = { horizontal: 'center' }
          break;
        case 'Logger_Time':
        case 'Unit_Price':
        case 'Total_Price':
        case 'tax':
          column.alignment = { horizontal: 'right' }
          break;
      
        default:
          break;
      }
    });

    // Add data to the worksheet
    exportInvoices.forEach((invoice, index, array) => {
      if (!invoice) return
      const invoiceJson = invoice.toJSON()
      const {Unit_Price, Quantity} = invoiceJson
      const taxPercent = 10
      const totalPrice = formatNumber(Number(invoiceJson.Total_Price))
      const tax = formatNumber(Number(invoiceJson.Total_Price) * taxPercent / 100)

      const invoiceDateFormated = {
        order: index + 1,
        customerName: 'Xuất bán lẻ',
        paymentType: 'Tiền mặt/Chuyển khoản',
        taxNumber: '',
        address: '',
        email: '',
        buyer: '',
        taxPercent,
        tax,
        Quantity: formatNumber(Number(Quantity)),
        unit: 'Lít',
        Unit_Price: formatNumber(Number(Unit_Price)),
        Total_Price: totalPrice,
        Fuel_Type: invoiceJson.Fuel_Type || '',
        Logger_Time: moment(invoice.Logger_Time).format("DD-MM-YYYY"),
      }
      worksheet.addRow(invoiceDateFormated)
    })

    const titleRow = worksheet.getRow(1);
    titleRow.height = 30
    titleRow.eachCell(cell => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ccccff' }
      }
      cell.font = {
        bold: true
      }
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    });

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

  deleteBulk = async (req, res, next) => {
    new OK({
      message: 'Delete invoices success!',
      data: await InvoiceService.deleteBulk(req.body)
    }).send(res)
  }

  restoreBulk = async (req, res, next) => {
    new OK({
      message: 'Restore invoices success!',
      data: await InvoiceService.restoreBulk(req.body)
    }).send(res)
  }

  restore = async (req, res, next) => {
    new OK({
      message: 'Restore invoice success!',
      data: await InvoiceService.restore(req.params.id)
    }).send(res)
  }
}

module.exports = new InvoiceController()
