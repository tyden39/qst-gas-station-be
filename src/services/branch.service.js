const { Op, Sequelize } = require("sequelize")
const Branch = require("../models/branch.model")
const Company = require("../models/company.model")
const { NotFoundError } = require("../core/error.response")
const bcrypt = require('bcrypt')

class BranchService {
  static async getSimpleList({ query }) {
    // const { keyword, startDate, endDate } = query

    // const pageSize = +query.pageSize
    // const page = +query.page
    // const offset = (page - 1) * pageSize

    // const keywordFilter = keyword
    //   ? {
    //       [Op.or]: [
    //         { name: { [Op.like]: `%${keyword}%` } },
    //         { subTaxCode: { [Op.like]: `%${keyword}%` } },
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

    const { count, rows } = await Branch.findAndCountAll({
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

  static async getById(id) {
    return await Branch.findOne({
      where: { id },
      attributes: [
        "id",
        "name",
        "subTaxCode",
        "address",
        "email",
        "phone",
        "companyId",
        [Sequelize.literal("`Company`.`name`"), "companyName"],
      ],
      include: [Company],
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
            { subTaxCode: { [Op.like]: `%${keyword}%` } },
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

    const { count, rows } = await Branch.findAndCountAll({
      where,
      limit: pageSize,
      offset: offset,
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "name",
        "subTaxCode",
        "address",
        "email",
        "phone",
        "companyId",
        [Sequelize.literal("`Company`.`name`"), "companyName"],
      ],
      include: [Company],
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
    const editData = {...data, ...password}

    const branch = await Branch.findOne({
      where: { id },
      attributes: [
        "id",
        "name",
        "subTaxCode",
        "address",
        "email",
        "phone",
        "companyId",
        [Sequelize.literal("`Company`.`name`"), "companyName"],
      ],
      include: [Company],
    })
    if (!branch) {
      throw new NotFoundError("Không tìm thấy chi nhánh cần chỉnh sửa!")
    }
    return await branch.update(editData)
  }

  static async delete(id) {
    const branch = await Branch.findByPk(id)
    if (!branch) {
      throw new NotFoundError("Không tìm thấy chi nhánh cần xóa!")
    }
    await Branch.destroy({ where: { id }, force: true })
  }
}

module.exports = BranchService
