"use strict"

const { CREATED, OK } = require("../core/success.response")
const BranchService = require("../services/branch.service")

class BranchController {
  getSimpleList = async (req, res, next) => {
    new OK({
      message: 'Get branches success!',
      ...await BranchService.getSimpleList(req)
    }).send(res)
  }

  getAll = async (req, res, next) => {
    new OK({
      message: 'Get branches success!',
      data: await BranchService.getAll(req)
    }).send(res)
  }

  getOne = async (req, res, next) => {
    new OK({
      message: 'Get branch success!',
      data: await BranchService.getById(req.params.id)
    }).send(res)
  }

  update = async (req, res, next) => {
    new OK({
      message: 'Update branch success!',
      data: await BranchService.update(req.params.id, req.body)
    }).send(res)
  }

  create = async (req, res, next) => {
    new CREATED({
      message: 'Update branch success!',
      data: await BranchService.create(req.body)
    }).send(res)
  }

  delete = async (req, res, next) => {
    new OK({
      message: 'Delete branch success!',
      data: await BranchService.delete(req.params.id, req.body.force)
    }).send(res)
  }

  restore = async (req, res, next) => {
    new OK({
      message: 'Restore branch success!',
      data: await BranchService.restore(req.params.id)
    }).send(res)
  }
}

module.exports = new BranchController()
