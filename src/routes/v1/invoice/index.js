"use strict"

const express = require('express')
const asyncHandler = require('../../../helpers/asyncHandler')
// const { authentication } = require('../../auth/authUtils')
const invoiceController = require('../../../controllers/invoice.controller')
const router = express.Router()

// router.use(authentication)

router.post('/create', asyncHandler(invoiceController.createInvoice))
router.get('/list', asyncHandler(invoiceController.getInvoices))
router.post('/edit/:id', asyncHandler(invoiceController.updateInvoice))
router.delete('/delete/:id', asyncHandler(invoiceController.deleteInvoice))
router.get('/export-excel', asyncHandler(invoiceController.exportExcel))
router.get('/:id', asyncHandler(invoiceController.getInvoice))
router.post('/restore/:id', asyncHandler(invoiceController.restore))
router.delete('/deleteBulk', asyncHandler(invoiceController.deleteBulk))
router.post('/restoreBulk', asyncHandler(invoiceController.restoreBulk))

module.exports = router