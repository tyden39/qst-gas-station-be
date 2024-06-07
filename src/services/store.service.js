const { Op, Sequelize } = require("sequelize")
const Store = require("../models/store.model")
const Branch = require("../models/branch.model")
const Company = require("../models/company.model")
const { NotFoundError } = require("../core/error.response")
const bcrypt = require('bcrypt')

class StoreService {

  static async getAll({ query }) {
    // const { keyword, startDate, endDate } = query

    // const pageSize = +query.pageSize
    // const page = +query.page
    // const offset = (page - 1) * pageSize

    // const keywordFilter = keyword
    //   ? {
    //       [Op.or]: [
    //         { name: { [Op.like]: `%${keyword}%` } },
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

    // // Combine filters
    // const where = {
    //   ...dateFilter,
    //   ...keywordFilter,
    // }

    const { count, rows } = await Store.findAndCountAll({
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
    return await Store.create(data)
  }

  static async getById(id) {
    return await Store.findOne({
      where: { id },
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        "address",
        "branchId",
        "companyId",
        [Sequelize.literal("`Branch`.`name`"), "branchName"],
        [Sequelize.literal("`Company`.`name`"), "companyName"],
      ],
      include: [Branch, Company],
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

    const { count, rows } = await Store.findAndCountAll({
      where,
      limit: pageSize,
      offset: offset,
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        "address",
        "branchId",
        "companyId",
        [Sequelize.literal("`Branch`.`name`"), "branchName"],
        [Sequelize.literal("`Company`.`name`"), "companyName"],
      ],
      include: [Branch, Company],
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

  static async update(id, data) {
    const password = data.password ? {password: await bcrypt.hash(data.password, 10)} : {}
    const editUser = {...data, ...password}

    const store = await Store.findOne({
      where: { id },
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        "address",
        "branchId",
        "companyId",
        [Sequelize.literal("`Branch`.`name`"), "branchName"],
        [Sequelize.literal("`Company`.`name`"), "companyName"],
      ],
      include: [Branch, Company],
    })
    if (!store) {
      throw new NotFoundError("Không tìm thấy cửa hàng cần chỉnh sửa!")
    }
    return await store.update(editUser)
  }

  static async delete(id) {
    const store = await Store.findByPk(id)
    if (!store) {
      throw new NotFoundError("Không tìm thấy cửa hàng cần xóa!")
    }
    await Store.destroy({ where: { id }, force: true })
  }
}

module.exports = StoreService
