"use strict"

const express = require('express')
const asyncHandler = require('../../../helpers/asyncHandler')
// const { authentication } = require('../../auth/authUtils')
const userController = require('../../../controllers/user.controller')
const router = express.Router()

// router.use(authentication)

router.get('/list', asyncHandler(userController.getUsers))
router.get('/:id', asyncHandler(userController.getUser))
router.post('/edit/:id', asyncHandler(userController.updateUser))
router.post('/create', asyncHandler(userController.createUser))
router.delete('/delete/:id', asyncHandler(userController.deleteUser))

module.exports = router