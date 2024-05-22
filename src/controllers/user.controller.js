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
      data: await UserService.getUserById(req.params)
    }).send(res)
  }

  updateUser = async (req, res, next) => {
    new OK({
      message: 'Update user success!',
      data: await UserService.updateUser(req.body)
    }).send(res)
  }
}

module.exports = new UserController()
