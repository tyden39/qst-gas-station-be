"use strict"

const express = require('express')
const accessController = require('../../../controllers/access.controller')
const asyncHandler = require('../../../helpers/asyncHandler')
const { authentication } = require('../../../auth/authUtils')
const router = express.Router()

router.post('/signup', asyncHandler(accessController.signUp))
router.post('/login', asyncHandler(accessController.login))

router.use(authentication)

router.get('/logout', asyncHandler(accessController.logout))
// router.post('/refresh-token', asyncHandler(accessController.refreshToken))

module.exports = router