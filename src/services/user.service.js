const { Op, Sequelize } = require("sequelize")
const User = require("../models/user.model")
const Branch = require("../models/branch.model")
const Company = require("../models/company.model")
const { NotFoundError } = require("../core/error.response")
const bcrypt = require("bcrypt")
const Store = require("../models/store.model")
const { getCompanyFilter, getBranchFilter, getStoreFilter } = require("../utils/permission.v2")

const getAllowRoles = (role) => {
  switch (role) {
    case "000":
      return ["000", "001", "002", "003", "004"]
    case "001":
      return ["001", "002", "003", "004"]
    case "002":
      return ["002", "003", "004"]
    case "003":
      return ["003", "004"]
    case "004":
      return ["004"]

    default:
      return ["004"]
  }
}
class UserService {
  static findByUsername = async ({ username }) => {
    return await User.findOne({
      where: {
        username,
      },
    })
  }

  static async createUser(data) {
    const allowRoles = getAllowRoles(data.roles)
    data.roles = allowRoles
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

  static async getUsers({ query, keyStore }) {
    const authUser = (await UserService.getUserById(keyStore.user)).toJSON()
    const { keyword, startDate, endDate, companyId, branchId, storeId } = query

    const companyFilter = getCompanyFilter(authUser, companyId)
    const branchFilter = getBranchFilter(authUser, branchId)
    const storeFilter = getStoreFilter(authUser, storeId)

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
      ...companyFilter,
      ...branchFilter,
      ...storeFilter,
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
      // include: [{
      //   model: Store,
      //   where: {...storeFilter},
      //   attributes: [],
      //   include: [{
      //     model: Branch,
      //     where: { ...branchFilter },
      //     attributes: [],
      //     include: [{
      //       model: Company,
      //       where: { ...companyFilter },
      //       attributes: [],
      //     }]
      //     }]
      // }],
      include: [Store, Branch, Company]
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
    const password = data.password
      ? { password: await bcrypt.hash(data.password, 10) }
      : {}
    
    const allowRoles = getAllowRoles(data.roles)
    data.roles = allowRoles

    const editUser = { ...data, ...password }

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
      ],
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
