"use strict"

const express = require('express')
const asyncHandler = require('../../../helpers/asyncHandler')
const storeController = require('../../../controllers/store.controller')
const router = express.Router()

router.get('/list', asyncHandler(storeController.getAll))
router.get('/simple-list', asyncHandler(storeController.getSimpleList))
router.post('/create', asyncHandler(storeController.create))
router.get('/:id', asyncHandler(storeController.getOne))
router.post('/edit/:id', asyncHandler(storeController.update))
router.delete('/delete/:id', asyncHandler(storeController.delete))
router.post('/restore/:id', asyncHandler(storeController.restore))

module.exports = router