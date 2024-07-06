const { Op, Sequelize } = require("sequelize")
const Branch = require("../models/branch.model")
const Company = require("../models/company.model")
const { NotFoundError } = require("../core/error.response")
const bcrypt = require('bcrypt')
const UserService = require("./user.service")
const { getCompanyFilter, getBranchFilter } = require("../utils/permission")
const { PERMISSION } = require("../constants/auth/permission")
const User = require("../models/user.model")

class BranchService {
  static async getSimpleList({ query, keyStore }) {
    const { 
      // keyword, startDate, endDate,
      companyId
    } = query
    const companyFilter = getCompanyFilter(keyStore, companyId)
    const branchFilter = getBranchFilter(keyStore)

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
    const where = {
      ...branchFilter,
      // ...dateFilter,
      // ...keywordFilter,
    }

    const { count, rows } = await Branch.findAndCountAll({
      where,
      // limit: pageSize,
      // offset: offset,
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "name",
        "companyId",
        [Sequelize.literal("`Company`.`name`"), "companyName"],
      ],
      include: [{
        model: Company,
        where: { ...companyFilter }
      }]
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

  static async getById({params: {id}, keyStore}) {
    const {roles} = keyStore
    const isAdmin = roles[0] === PERMISSION.ADMINISTRATOR
    
    return await Branch.findOne({
      where: { id },
      paranoid: !isAdmin,
      attributes: {
        include: [
          [Sequelize.literal("`Company`.`name`"), "companyName"],
        ]
      },
      include: [Company],
    })
  }

  static async getAll({ query, keyStore }) {
    const { keyword, startDate, endDate, companyId, sortBy } = query

    const {roles} = keyStore
    const isAdmin = roles[0] === PERMISSION.ADMINISTRATOR
    const companyFilter = getCompanyFilter(keyStore, companyId)

    const pageSize = +query.pageSize
    const page = +query.page
    const offset = (page - 1) * pageSize

    const sortByFilter = JSON.parse(sortBy) || [["createdAt", "DESC"]]

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
      paranoid: !isAdmin,
      limit: pageSize,
      offset: offset,
      order: [...sortByFilter],
      attributes: {
        include: [
          [Sequelize.literal("`Company`.`name`"), "companyName"],
        ]
      },
      include: [{
        model: Company,
        where: { ...companyFilter }
      }]
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

  static async create(data) {
    return await Branch.create(data)
  }

  static async update(id, data) {
    const password = data.password ? {password: await bcrypt.hash(data.password, 10)} : {}
    const editData = {...data, ...password}

    const branch = await Branch.findOne({
      where: { id },
      attributes: {
        include: [
          [Sequelize.literal("`Company`.`name`"), "companyName"],
        ]
      },
      include: [Company],
    })
    if (!branch) {
      throw new NotFoundError("Không tìm thấy chi nhánh cần chỉnh sửa!")
    }
    return await branch.update(editData)
  }

  static async delete(id, force) {
    const branch = await Branch.findByPk(id, { paranoid: !force })
    if (!branch) {
      throw new NotFoundError("Không tìm thấy chi nhánh cần xóa!")
    }
    await branch.destroy({ force: Boolean(force) })
  }

  static async restore(id) {
    const branch = await Branch.findByPk(id, { paranoid: false })
    if (!branch) {
      throw new NotFoundError("Không tìm thấy chi nhánh cần khôi phục!")
    }
    await branch.restore()
  }
}

module.exports = BranchService
