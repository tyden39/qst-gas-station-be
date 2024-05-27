'use strict'

const express = require('express')
// const { apiKey, permission } = require('../auth/checkAuth')
const router = express.Router()

// // check apikey
// router.use(apiKey)

// // check permission
// router.use(permission('0000'))

router.use('/api/v1', require('./v1'))

module.exports = router
