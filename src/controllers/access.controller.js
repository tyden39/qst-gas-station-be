"use strict"

const { CREATED, OK } = require("../core/success.response")
const AccessService = require("../services/access.service")

class AccessController {
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Đăng ký thành công!",
      data: await AccessService.signUp(req.body),
    }).send(res)
  }
  
  login = async (req, res, next) => {
    new OK({ 
      message: 'Đăng nhập thành công!',
      data: await AccessService.login(req.body) 
    }).send(res)
  }

  logout = async (req, res, next) => {
    new OK({
      message: 'Đăng xuất thành công!',
      data: await AccessService.logout(req)
    }).send(res)
  }

  // refreshToken = async (req, res, next) => {
  //   new OK({
  //     message: 'Refresh success',
  //     data: await AccessService.handleRefreshToken(req.body)
  //   }).send(res)
  // }
}

module.exports = new AccessController()
