const { Op, Sequelize } = require("sequelize")
const Company = require("../models/company.model")
const { NotFoundError } = require("../core/error.response")
const bcrypt = require('bcrypt')

class CompanyService {
  static async getSimpleList({ query }) {
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
    }

    const { count, rows } = await Company.findAndCountAll({
      // where,
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
    return await Company.create(data)
  }

  static async getById(id) {
    return await Company.findOne({
      where: { id },
      attributes: [
        "id",
        "name",
        "taxCode",
        "email",
        "phone",
        "address",
      ],
    })
  }

  static async getAll({ query }) {
    const { keyword, startDate, endDate } = query

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
      attributes: [
        "id",
        "name",
        "taxCode",
        "email",
        "phone",
        "address",
      ],
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

  static async deleteOne(id) {
    const user = await Company.findByPk(id)
    if (!user) {
      throw new NotFoundError(`Không tìm thấy công ty cần xóa!`)
    }
    await Company.destroy({ where: { id }, force: true })
  }
}

module.exports = CompanyService
