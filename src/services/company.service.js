const { Op, Sequelize } = require("sequelize")
const Company = require("../models/company.model")
const { NotFoundError } = require("../core/error.response")
const bcrypt = require('bcrypt')
const UserService = require("./user.service")
const { getCompanyFilter } = require("../utils/permission")
const { createCompanyTokens } = require("../auth/authUtils")
const { PERMISSION } = require("../constants/auth/permission")
const User = require("../models/user.model")

class CompanyService {
  static async getSimpleList({ query, keyStore }) {
    const companyFilter = getCompanyFilter(keyStore)

    // const { keyword, startDate, endDate } = query

    // const pageSize = +query.pageSize
    // const page = +query.page
    // const offset = (page - 1) * pageSize

    // const keywordFilter = keyword
    //   ? {
    //       [Op.or]: [
    //         { name: { [Op.like]: `%${keyword}%` } },
    //         { taxCode: { [Op.like]: `%${keyword}%` } },
    //         { address: { [Op.like]: `%${keyword}%` } },
    //         { email: { [Op.like]: `%${keyword}%` } },
    //         { phone: { [Op.like]: `%${keyword}%` } },
    //       ],
    //     }
    //   : {}

    // const dateFilter =
    //   startDate && endDate
    //     ? {
    //         createdAt: {
    //           [Op.between]: [new Date(startDate), new Date(endDate)],
    //         },
    //       }
    //     : {}

    // Combine filters
    const where = {
      // ...dateFilter,
      // ...keywordFilter,
      ...companyFilter
    }

    const { count, rows } = await Company.findAndCountAll({
      where,
      // limit: pageSize,
      // offset: offset,
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "name",
      ],
    })

    return {
      data: rows,
      // meta: {
      //   totalItems: count,
      //   totalPages: Math.ceil(count / pageSize),
      //   currentPage: page,
      //   pageSize: pageSize,
      // },
    }
  }

  static async create(data) {
    const newCompany = await Company.create(data)
    const token = await createCompanyTokens(newCompany.id, newCompany.name)

    return await newCompany.update({token})
  }

  static async getById({params: {id}, keyStore}) {
    const isAdmin = keyStore?.roles[0] === PERMISSION.ADMINISTRATOR

    return await Company.findOne({
      where: { id },
      paranoid: !isAdmin,
    })
  }

  static async getAll({ query, keyStore }) {
    const { keyword, startDate, endDate } = query
    const isAdmin = keyStore.roles[0] === PERMISSION.ADMINISTRATOR

    const pageSize = +query.pageSize
    const page = +query.page
    const offset = (page - 1) * pageSize

    const keywordFilter = keyword
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${keyword}%` } },
            { taxCode: { [Op.like]: `%${keyword}%` } },
            { address: { [Op.like]: `%${keyword}%` } },
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

    const { count, rows } = await Company.findAndCountAll({
      where,
      limit: pageSize,
      offset: offset,
      order: [["createdAt", "DESC"]],
      paranoid: !isAdmin,
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

  static async updateOne(id, data) {
    const password = data.password ? {password: await bcrypt.hash(data.password, 10)} : {}
    const editUser = {...data, ...password}

    const user = await Company.findOne({
      where: { id },
      paranoid: false,
      attributes: [
        "id",
        "name",
        "taxCode",
        "email",
        "phone",
        "address",
      ],
    })
    if (!user) {
      throw new NotFoundError(`Không tìm thấy công ty cần chỉnh sửa!`)
    }
    return await user.update(editUser)
  }

  static async deleteOne(id, force) {
    const company = await Company.findByPk(id, { paranoid: !force })
    if (!company) {
      throw new NotFoundError(`Không tìm thấy công ty cần xóa!`)
    }
    await company.destroy({ force: Boolean(force) })
  }

  static async restoreOne(id) {
    const company = await Company.findByPk(id, { paranoid: false })
    if (!company) {
      throw new NotFoundError("Không tìm thấy công ty cần khôi phục!")
    }
    await company.restore()
  }
}

module.exports = CompanyService
