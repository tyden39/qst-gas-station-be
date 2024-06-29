const { Op, Sequelize } = require("sequelize")
const User = require("../models/user.model")
const Branch = require("../models/branch.model")
const Company = require("../models/company.model")
const { NotFoundError, BadRequestError } = require("../core/error.response")
const bcrypt = require("bcrypt")
const Store = require("../models/store.model")
const {
  getCompanyFilter,
  getBranchFilter,
  getStoreFilter,
} = require("../utils/permission.v2")
const KeyTokenService = require("./keyToken.service")
const { update } = require("lodash")
const { PERMISSION } = require("../constants/auth/permission")

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
    const holderUser = await User.findOne({
      where: { username: data.username },
    })
    if (holderUser) {
      throw new BadRequestError(`Tên đăng nhập "${data.username}" đã tồn tại!`)
    }

    const allowRoles = getAllowRoles(data.roles)
    data.roles = allowRoles

    const passwordHash = await bcrypt.hash(data.password, 10)
    return await User.create({
      ...data,
      password: passwordHash,
    })
  }

  static async getUserById(id, keyStore) {
    let authUser = null
    if (keyStore)
      authUser = await User.findOne({
        where: { id },
        paranoid: false,
      })
    const isAdmin = authUser?.roles[0] === PERMISSION.ADMINISTRATOR

    return await User.findOne({
      where: { id },
      paranoid: keyStore ? !isAdmin : false,
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
        "deletedAt",
        [Sequelize.literal("`Store`.`name`"), "storeName"],
        [Sequelize.literal("`Branch`.`name`"), "branchName"],
        [Sequelize.literal("`Company`.`name`"), "companyName"],
      ],
      include: [Store, Branch, Company],
    })
  }

  static async getUsers({ query, keyStore }) {
    const authUser = (await UserService.getUserById(keyStore.user)).toJSON()
    const isAdmin = authUser.roles[0] === PERMISSION.ADMINISTRATOR

    const { keyword, startDate, endDate, companyId, branchId, storeId } = query

    const companyFilter = getCompanyFilter(authUser, companyId)
    const branchFilter = getBranchFilter(authUser, branchId)
    const storeFilter = getStoreFilter(authUser, storeId)
    const rolesFilter = { roles: authUser.roles }

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
      paranoid: !isAdmin,
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
        "deletedAt",
        [Sequelize.literal("`Store`.`name`"), "storeName"],
        [Sequelize.literal("`Branch`.`name`"), "branchName"],
        [Sequelize.literal("`Company`.`name`"), "companyName"],
      ],
      include: [Store, Branch, Company],
    })

    const data = rows.filter((r) => authUser.roles.includes(r.roles?.[0]))

    return {
      data,
      meta: {
        totalItems: count,
        totalPages: Math.ceil(count / pageSize),
        currentPage: page,
        pageSize: pageSize,
      },
    }
  }

  static async updateUser(id, data) {
    const user = await User.findOne({
      where: { id },
      paranoid: false,
      attributes: [
        "id",
        "username",
        "password",
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

    if (data.password) {
      const passwordMatch = await bcrypt.compare(data.password, user.password)
      if (!passwordMatch) {
        const keyStore = await KeyTokenService.findByPropertyName("user", id)
        if (keyStore) await KeyTokenService.removeKeyById(keyStore.id)

        const encryptPassword = await bcrypt.hash(data.password, 10)
        data.password = encryptPassword
      }
    }

    if (data.roles && data.roles !== user.roles) {
      const keyStore = await KeyTokenService.findByPropertyName("user", id)
      if (keyStore) await KeyTokenService.removeKeyById(keyStore.id)

      const allowRoles = getAllowRoles(data.roles)
      data.roles = allowRoles
    }

    const updatedUser = await (await user.update(data)).toJSON()
    delete updatedUser.password

    return updatedUser
  }

  static async deleteUser(id, force) {
    const user = await User.findByPk(id, { paranoid: !force })
    if (!user) {
      throw new NotFoundError("Không tìm thấy người dùng")
    }
    await user.destroy({ force: Boolean(force) })
  }

  static async restore(id) {
    const user = await User.findByPk(id, { paranoid: false })
    if (!user) {
      throw new NotFoundError("Không tìm thấy người dùng cần khôi phục!")
    }
    await user.restore()
  }
}

module.exports = UserService
