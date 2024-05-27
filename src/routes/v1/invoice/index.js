"use strict"

const express = require('express')
const asyncHandler = require('../../../helpers/asyncHandler')
// const { authentication } = require('../../auth/authUtils')
const invoiceController = require('../../../controllers/invoice.controller')
const router = express.Router()

// router.use(authentication)

router.post('/import', asyncHandler(invoiceController.importOneInvoice))
router.get('/list', asyncHandler(invoiceController.getInvoices))
router.get('/:id/:storeId', asyncHandler(invoiceController.getInvoice))
router.post('/edit/:id', asyncHandler(invoiceController.updateInvoice))
// router.post('/import-excel', asyncHandler(invoiceController.importExcel))
router.get('/export-excel', asyncHandler(invoiceController.exportExcel))

module.exports = router