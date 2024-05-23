"use strict"

const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
// const { authentication } = require('../../auth/authUtils')
const userController = require('../../controllers/user.controller')
const router = express.Router()

// router.use(authentication)

router.get('/user/list', asyncHandler(userController.getUsers))
router.get('/user/:id', asyncHandler(userController.getUser))
router.post('/user/edit/:id', asyncHandler(userController.updateUser))
router.post('/user/create', asyncHandler(userController.createUser))
router.delete('/user/delete/:id', asyncHandler(userController.deleteUser))

module.exports = router