"use strict"

const { CREATED, OK } = require("../core/success.response")
const UserService = require("../services/user.service")

class UserController {
  importOneUser = async (req, res, next) => {
    new CREATED({
      message: "Import an user success!",
      data: await UserService.createUser(req.body),
    }).send(res)
  }

  getUsers = async (req, res, next) => {
    new OK({
      message: 'Get users success!',
      data: await UserService.getUsers(req)
    }).send(res)
  }

  getUser = async (req, res, next) => {
    new OK({
      message: 'Get user success!',
      data: await UserService.getUserById(req.params.id)
    }).send(res)
  }

  updateUser = async (req, res, next) => {
    new OK({
      message: 'Update user success!',
      data: await UserService.updateUser(req.params.id, req.body)
    }).send(res)
  }

  createUser = async (req, res, next) => {
    new CREATED({
      message: 'Update user success!',
      data: await UserService.createUser(req.body)
    }).send(res)
  }

  deleteUser = async (req, res, next) => {
    new OK({
      message: 'Delete user success!',
      data: await UserService.deleteUser(req.params.id, req.body.force)
    }).send(res)
  }

  restore = async (req, res, next) => {
    new OK({
      message: 'Restore user success!',
      data: await UserService.restore(req.params.id)
    }).send(res)
  }
}

module.exports = new UserController()
