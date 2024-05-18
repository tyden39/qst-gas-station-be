"use strict"

const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const invoiceController = require('../../controllers/invoice.controller')
const router = express.Router()

router.use(authentication)

router.post('/invoice/list', asyncHandler(invoiceController.getAllInvoice))
router.post('/invoice/import-logger', asyncHandler(invoiceController.importLogger))
// router.post('/invoice/import-excel', asyncHandler(invoiceController.importExcel))
router.post('/invoice/export-excel', asyncHandler(invoiceController.exportExcel))
router.post('/invoice/edit/:id', asyncHandler(invoiceController.updateInvoice))

module.exports = router