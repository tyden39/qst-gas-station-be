"use strict"

const { CREATED, OK } = require("../core/success.response")
const StoreService = require("../services/store.service")

class StoreController {
  getSimpleList = async (req, res, next) => {
    new OK({
      message: 'Get stores success!',
      ...await StoreService.getSimpleList(req)
    }).send(res)
  }

  getAll = async (req, res, next) => {
    new OK({
      message: 'Get stores success!',
      data: await StoreService.getAll(req)
    }).send(res)
  }

  getOne = async (req, res, next) => {
    new OK({
      message: 'Get company success!',
      data: await StoreService.getById(req.params.id)
    }).send(res)
  }

  update = async (req, res, next) => {
    new OK({
      message: 'Update company success!',
      data: await StoreService.update(req.params.id, req.body)
    }).send(res)
  }

  create = async (req, res, next) => {
    new CREATED({
      message: 'Update company success!',
      data: await StoreService.create(req.body)
    }).send(res)
  }

  delete = async (req, res, next) => {
    new OK({
      message: 'Delete company success!',
      data: await StoreService.delete(req.params.id)
    }).send(res)
  }
}

module.exports = new StoreController()