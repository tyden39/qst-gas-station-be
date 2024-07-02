"use strict"

const { CREATED, OK } = require("../core/success.response")
const LoggerService = require("../services/logger.service")

class StoreController {
  getSimpleList = async (req, res, next) => {
    new OK({
      message: 'Get logger success!',
      ...await LoggerService.getSimpleList(req)
    }).send(res)
  }

  getAll = async (req, res, next) => {
    new OK({
      message: 'Get loggers success!',
      data: await LoggerService.getAll(req)
    }).send(res)
  }

  getOne = async (req, res, next) => {
    new OK({
      message: 'Get logger success!',
      data: await LoggerService.getById(req)
    }).send(res)
  }

  update = async (req, res, next) => {
    new OK({
      message: 'Update logger success!',
      data: await LoggerService.update(req.params.id, req.body)
    }).send(res)
  }

  create = async (req, res, next) => {
    new CREATED({
      message: 'Update logger success!',
      data: await LoggerService.create(req)
    }).send(res)
  }

  delete = async (req, res, next) => {
    new OK({
      message: 'Delete logger success!',
      data: await LoggerService.delete(req.params.id, req.body.force)
    }).send(res)
  }

  restore = async (req, res, next) => {
    new OK({
      message: 'Restore logger success!',
      data: await LoggerService.restore(req.params.id)
    }).send(res)
  }
}

module.exports = new StoreController()
