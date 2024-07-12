const { Op, Sequelize } = require("sequelize")
const Store = require("../models/store.model")
const Branch = require("../models/branch.model")
const Company = require("../models/company.model")
const { NotFoundError } = require("../core/error.response")
const bcrypt = require("bcrypt")
const UserService = require("./user.service")
const {
  getCompanyFilter,
  getBranchFilter,
  getStoreFilter,
} = require("../utils/permission")
const { PERMISSION } = require("../constants/auth/permission")

class StoreService {
  static async getSimpleList({ query, keyStore }) {
    const authUser = keyStore
    
    const {
      // keyword, startDate, endDate,
      companyId,
      branchId,
    } = query
    const companyFilter = getCompanyFilter(authUser, companyId)
    const branchFilter = getBranchFilter(authUser, branchId)
    const storeFilter = getStoreFilter(authUser)

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
    const where = {
      ...storeFilter,
      // ...dateFilter,
      // ...keywordFilter,
    }

    const { count, rows } = await Store.findAndCountAll({
      where,
      // limit: pageSize,
      // offset: offset,
      order: [["name", "ASC"]],
      attributes: [
        "id",
        "name",
        "branchId",
        [Sequelize.literal("`Branch->Company`.`id`"), "companyId"],
      ],
      include: [
        {
          model: Branch,
          where: { ...branchFilter },
          include: [
            {
              model: Company,
              where: { ...companyFilter },
            },
          ],
        },
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

  static async getById({params: {id}, keyStore}) {
    const authUser = keyStore
    const isAdmin = authUser.roles[0] === PERMISSION.ADMINISTRATOR

    return await Store.findOne({
      where: { id },
      paranoid: !isAdmin,
      attributes: {
        include: [
          [Sequelize.literal("`Branch`.`name`"), "branchName"],
          [Sequelize.literal("`Branch->Company`.`name`"), "companyName"],
          [Sequelize.literal("`Branch->Company`.`id`"), "companyId"],
        ],
      },
      include: [
        {
          model: Branch,
          attributes: [],
          include: [
            {
              model: Company,
              attributes: [],
            },
          ],
        },
      ],
    })
  }

  static async getAll({ query, keyStore }) {
    const authUser = keyStore
    const isAdmin = authUser.roles[0] === PERMISSION.ADMINISTRATOR

    const { keyword, startDate, endDate, companyId, branchId, storeId, sortBy } = query

    const sortByFilter = sortBy && sortBy.lenght > 0 ? JSON.parse(sortBy) : [["createdAt", "DESC"]]
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

    const companyFilter = getCompanyFilter(authUser, companyId)
    const branchFilter = getBranchFilter(authUser, branchId)

    // Combine filters
    const where = {
      ...dateFilter,
      ...keywordFilter,
    }

    const { count, rows } = await Store.findAndCountAll({
      where,
      paranoid: !isAdmin,
      limit: pageSize,
      offset: offset,
      order: [...sortByFilter],
      attributes: {
        include: [
          [Sequelize.literal("`Branch`.`name`"), "branchName"],
          [Sequelize.literal("`Branch->Company`.`name`"), "companyName"],
          [Sequelize.literal("`Branch->Company`.`id`"), "companyId"],
        ],
      },
      include: [
        {
          model: Branch,
          attributes: [],
          where: { ...branchFilter },
          include: [
            {
              model: Company,
              where: { ...companyFilter },
              attributes: [],
            },
          ],
        },
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

  static async update(id, data) {
    const password = data.password
      ? { password: await bcrypt.hash(data.password, 10) }
      : {}
    const editUser = { ...data, ...password }

    const store = await Store.findOne({
      where: { id },
      attributes: ["id", "name", "email", "phone", "address", "branchId"],
    })
    if (!store) {
      throw new NotFoundError("Không tìm thấy cửa hàng cần chỉnh sửa!")
    }
    return await store.update(editUser)
  }

  static async delete(id, force) {
    const store = await Store.findByPk(id, { paranoid: !force })
    if (!store) {
      throw new NotFoundError("Không tìm thấy cửa hàng cần xóa!")
    }
    await Store.destroy({ where: { id }, force: Boolean(force) })
  }

  static async restore(id) {
    const store = await Store.findByPk(id, { paranoid: false })
    if (!store) {
      throw new NotFoundError("Không tìm thấy cửa hàng cần khôi phục!")
    }
    await store.restore()
  }
}

module.exports = StoreService
