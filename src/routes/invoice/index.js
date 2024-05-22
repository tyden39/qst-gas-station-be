"use strict"

const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
// const { authentication } = require('../../auth/authUtils')
const invoiceController = require('../../controllers/invoice.controller')
const router = express.Router()

// router.use(authentication)

router.post('/invoice/import', asyncHandler(invoiceController.importOneInvoice))
router.get('/invoice/list', asyncHandler(invoiceController.getInvoices))
router.get('/invoice/:id/:storeId', asyncHandler(invoiceController.getInvoice))
router.post('/invoice/edit/:id', asyncHandler(invoiceController.updateInvoice))
// router.post('/invoice/import-excel', asyncHandler(invoiceController.importExcel))
router.get('/invoice/export-excel', asyncHandler(invoiceController.exportExcel))

module.exports = router