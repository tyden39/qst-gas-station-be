"use strict"

const express = require('express')
const asyncHandler = require('../../../helpers/asyncHandler')
const companyController = require('../../../controllers/company.controller')
const router = express.Router()

router.get('/list', asyncHandler(companyController.getAll))
router.get('/simple-list', asyncHandler(companyController.getSimpleList))
router.post('/edit/:id', asyncHandler(companyController.updateOne))
router.post('/create', asyncHandler(companyController.createOne))
router.delete('/delete/:id', asyncHandler(companyController.deleteOne))
router.get('/:id', asyncHandler(companyController.getOne))

module.exports = router