'use strict'
const express = require('express')

const router = express.Router()

router.use(require('./access'))
router.use('/invoice', require('./invoice'))
router.use('/user', require('./user'))
router.use('/company', require('./company'))
router.use('/branch', require('./branch'))
router.use('/store', require('./store'))
router.use('/logger', require('./logger'))

module.exports = router