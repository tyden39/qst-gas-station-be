"use strict"

const express = require('express')
const asyncHandler = require('../../../helpers/asyncHandler')
const loggerController = require('../../../controllers/logger.controller')
const router = express.Router()

router.get('/list', asyncHandler(loggerController.getAll))
router.get('/simple-list', asyncHandler(loggerController.getSimpleList))
router.post('/create', asyncHandler(loggerController.create))
router.get('/:id', asyncHandler(loggerController.getOne))
router.post('/edit/:id', asyncHandler(loggerController.update))
router.delete('/delete/:id', asyncHandler(loggerController.delete))
router.post('/restore/:id', asyncHandler(loggerController.restore))

module.exports = router