const { Op, Sequelize } = require("sequelize")
const User = require("../models/user.model")
const Branch = require("../models/branch.model")
const Company = require("../models/company.model")
const { NotFoundError } = require("../core/error.response")
const bcrypt = require('bcrypt')
const Store = require("../models/store.model")

class UserService {
  static findByUsername = async ({ username }) => {
    return await User.findOne({
      where: {
        username,
      },
    })
  }

  static async createUser(data) {
    return await User.create(data)
  }

  static async getUserById(id) {
    return await User.findOne({
      where: { id },
      attributes: [
        "id",
        "username",
        "firstName",
        "lastName",
        "email",
        "phone",
        "roles",
        "status",
        "branchId",
        "companyId",
        "storeId",
        [Sequelize.literal("`Store`.`name`"), "storeName"],
        [Sequelize.literal("`Branch`.`name`"), "branchName"],
        [Sequelize.literal("`Company`.`name`"), "companyName"],
      ],
      include: [Store, Branch, Company],
    })
  }

  static async getUsers({ query }) {
    const { keyword, startDate, endDate } = query

    const pageSize = +query.pageSize
    const page = +query.page
    const offset = (page - 1) * pageSize

    const keywordFilter = keyword
      ? {
          [Op.or]: [
            { username: { [Op.like]: `%${keyword}%` } },
            { firstName: { [Op.like]: `%${keyword}%` } },
            { lastName: { [Op.like]: `%${keyword}%` } },
            { email: { [Op.like]: `%${keyword}%` } },
            { phone: { [Op.like]: `%${keyword}%` } },
          ],
        }
      : {}

    const dateFilter =
      startDate && endDate
        ? {
            createdAt: {
              [Op.between]: [new Date(startDate), new Date(endDate)],
            },
          }
        : {}

    // Combine filters
    const where = {
      ...dateFilter,
      ...keywordFilter,
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      limit: pageSize,
      offset: offset,
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "username",
        "firstName",
        "lastName",
        "email",
        "phone",
        "roles",
        "status",
        "branchId",
        "companyId",
        "storeId",
        [Sequelize.literal("`Store`.`name`"), "storeName"],
        [Sequelize.literal("`Branch`.`name`"), "branchName"],
        [Sequelize.literal("`Company`.`name`"), "companyName"],
      ],
      include: [Store, Branch, Company],
    })

    return {
      data: rows,
      meta: {
        totalItems: count,
        totalPages: Math.ceil(count / pageSize),
        currentPage: page,
        pageSize: pageSize,
      },
    }
  }

  static async updateUser(id, data) {
    const password = data.password ? {password: await bcrypt.hash(data.password, 10)} : {}
    const editUser = {...data, ...password}

    const user = await User.findOne({
      where: { id },
      attributes: [
        "id",
        "username",
        "firstName",
        "lastName",
        "email",
        "phone",
        "roles",
        "status",
        "branchId",
        "companyId",
        "storeId",
        [Sequelize.literal("`Store`.`name`"), "storeName"],
        [Sequelize.literal("`Branch`.`name`"), "branchName"],
        [Sequelize.literal("`Company`.`name`"), "companyName"],
      ],
      include: [Store, Branch, Company],
    })
    if (!user) {
      throw new NotFoundError("Không tìm thấy người dùng")
    }
    return await user.update(editUser)
  }

  static async deleteUser(id) {
    const user = await User.findByPk(id)
    if (!user) {
      throw new NotFoundError("Không tìm thấy người dùng")
    }
    await User.destroy({ where: { id }, force: true })
  }

  // static async users {
  // return await User.findAll({
  //   include: [
  //       {
  //           model: Branch,
  //           attributes: ['branchName']
  //       },
  //       {
  //           model: Company,
  //           attributes: ['companyName']
  //       }
  //   ]
  // })}
}

module.exports = UserService
