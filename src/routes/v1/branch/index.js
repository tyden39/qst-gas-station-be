"use strict"

const express = require('express')
const asyncHandler = require('../../../helpers/asyncHandler')
const branchController = require('../../../controllers/branch.controller')
const router = express.Router()

router.get('/list', asyncHandler(branchController.getAll))
router.get('/simple-list', asyncHandler(branchController.getSimpleList))
router.post('/edit/:id', asyncHandler(branchController.update))
router.post('/create', asyncHandler(branchController.create))
router.delete('/delete/:id', asyncHandler(branchController.delete))
router.get('/:id', asyncHandler(branchController.getOne))

module.exports = router