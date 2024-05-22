"use strict"

const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
// const { authentication } = require('../../auth/authUtils')
const userController = require('../../controllers/user.controller')
const router = express.Router()

// router.use(authentication)

router.get('/user/list', asyncHandler(userController.getUsers))
router.get('/user/:id/:storeId', asyncHandler(userController.getUser))
router.post('/user/edit/:id', asyncHandler(userController.updateUser))

module.exports = router