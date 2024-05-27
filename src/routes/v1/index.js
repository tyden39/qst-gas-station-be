'use strict'
const express = require('express')

const router = express.Router()

router.use(require('./access'))
router.use('/invoice', require('./invoice'))
router.use('/user', require('./user'))

module.exports = router