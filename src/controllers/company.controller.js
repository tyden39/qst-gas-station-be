"use strict"

const { CREATED, OK } = require("../core/success.response")
const CompanyService = require("../services/company.service")

class CompanyController {
  getSimpleList = async (req, res, next) => {
    new OK({
      message: 'Get company success!',
      ...await CompanyService.getSimpleList(req)
    }).send(res)
  }

  getAll = async (req, res, next) => {
    new OK({
      message: 'Get company success!',
      data: await CompanyService.getAll(req)
    }).send(res)
  }

  getOne = async (req, res, next) => {
    new OK({
      message: 'Get company success!',
      data: await CompanyService.getById(req)
    }).send(res)
  }

  updateOne = async (req, res, next) => {
    new OK({
      message: 'Update company success!',
      data: await CompanyService.updateOne(req.params.id, req.body)
    }).send(res)
  }

  createOne = async (req, res, next) => {
    new CREATED({
      message: 'Create company success!',
      data: await CompanyService.create(req.body)
    }).send(res)
  }

  deleteOne = async (req, res, next) => {
    new OK({
      message: 'Delete company success!',
      data: await CompanyService.deleteOne(req.params.id, req.body.force)
    }).send(res)
  }

  restoreOne = async (req, res, next) => {
    new OK({
      message: 'Restore company success!',
      data: await CompanyService.restoreOne(req.params.id)
    }).send(res)
  }
}

module.exports = new CompanyController()
