const { Op, Sequelize } = require("sequelize")
const Logger = require("../models/logger.model")
const Branch = require("../models/branch.model")
const Company = require("../models/company.model")
const {
  NotFoundError,
  ConflictRequestError,
} = require("../core/error.response")
const bcrypt = require("bcrypt")
const UserService = require("./user.service")
const {
  getCompanyFilter,
  getBranchFilter,
  getStoreFilter,
} = require("../utils/permission")
const { getStoreFilter: getStoreFilterV2 } = require("../utils/permission.v2")
const Store = require("../models/store.model")
const { PERMISSION } = require("../constants/auth/permission")

class LoggerService {
  static async getSimpleList({ query, keyStore }) {
    const authUser = keyStore
    const {
      // keyword, startDate, endDate,
      // companyId,
      // branchId,
      storeId,
    } = query
    // const companyFilter = getCompanyFilter(authUser, companyId)
    // const branchFilter = getBranchFilter(authUser, branchId)
    const storeFilter = getStoreFilter(authUser, storeId)

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
      // ...dateFilter,
      // ...keywordFilter,
    }

    const { count, rows } = await Logger.findAndCountAll({
      where,
      // limit: pageSize,
      // offset: offset,
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "Logger_ID",
        "storeId",
        [Sequelize.literal("`Store`.`name`"), "storeName"],
        [Sequelize.literal("`Store->Branch`.`id`"), "branchId"],
        [Sequelize.literal("`Store->Branch`.`name`"), "branchName"],
        [Sequelize.literal("`Store->Branch->Company`.`id`"), "companyId"],
        [Sequelize.literal("`Store->Branch->Company`.`name`"), "companyName"],
      ],
      include: [
        {
          model: Store,
          attributes: [],
          where: { ...storeFilter },
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

  static async create({ body, keyStore }) {
    const authUser = keyStore
    const userStore = getStoreFilterV2(authUser)

    const logger = await Logger.findOne({
      where: { Logger_ID: body.Logger_ID },
    })
    if (logger)
      throw new ConflictRequestError(`Đã tồn tại logger mã ${body.Logger_ID}!`)

    return await Logger.create({ ...body, ...userStore })
  }

  static findByPropertyName = async ({propName, value, keyStore, force}) => {
    const authUser = keyStore
    const isAdmin = force ? true : authUser?.roles[0] === PERMISSION.ADMINISTRATOR

    let propValue
    switch (propName) {
      default:
        propValue = value
        break
    }

    const condition = {}
    condition[propName] = propValue

    const result = await Logger.findOne({
      where: condition,
      paranoid: !isAdmin,
      attributes: {
        include: [
          [Sequelize.literal("`Store`.`name`"), "storeName"],
          [Sequelize.literal("`Store->Branch`.`id`"), "branchId"],
          [Sequelize.literal("`Store->Branch`.`name`"), "branchName"],
          [Sequelize.literal("`Store->Branch->Company`.`id`"), "companyId"],
          [Sequelize.literal("`Store->Branch->Company`.`name`"), "companyName"],
        ],
      },
      include: [
        {
          model: Store,
          attributes: [],
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
        },
      ],
    })

    return result
  }

  static async getById({ params: { id }, keyStore }) {
    const authUser = keyStore
    const isAdmin = authUser?.roles[0] === PERMISSION.ADMINISTRATOR

    return await Logger.findOne({
      where: { id },
      paranoid: !isAdmin,
      attributes: {
        include: [
          [Sequelize.literal("`Store`.`name`"), "storeName"],
          [Sequelize.literal("`Store->Branch`.`id`"), "branchId"],
          [Sequelize.literal("`Store->Branch`.`name`"), "branchName"],
          [Sequelize.literal("`Store->Branch->Company`.`id`"), "companyId"],
          [Sequelize.literal("`Store->Branch->Company`.`name`"), "companyName"],
        ],
      },
      include: [
        {
          model: Store,
          attributes: [],
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
        },
      ],
    })
  }

  static async getAll({ query, keyStore }) {
    const authUser = keyStore
    const isAdmin = authUser.roles[0] === PERMISSION.ADMINISTRATOR

    const { keyword, startDate, endDate, companyId, branchId, storeId } = query

    const pageSize = +query.pageSize
    const page = +query.page
    const offset = (page - 1) * pageSize

    const keywordFilter = keyword
      ? {
          [Op.or]: [{ Logger_ID: { [Op.like]: `%${keyword}%` } }],
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
    const storeFilter = getStoreFilter(authUser, storeId)

    // Combine filters
    const where = {
      ...dateFilter,
      ...keywordFilter,
    }

    const { count, rows } = await Logger.findAndCountAll({
      where,
      paranoid: !isAdmin,
      limit: pageSize,
      offset: offset,
      order: [["createdAt", "DESC"]],
      attributes: {
        include: [
          [Sequelize.literal("`Store`.`name`"), "storeName"],
          [Sequelize.literal("`Store->Branch`.`id`"), "branchId"],
          [Sequelize.literal("`Store->Branch`.`name`"), "branchName"],
          [Sequelize.literal("`Store->Branch->Company`.`id`"), "companyId"],
          [Sequelize.literal("`Store->Branch->Company`.`name`"), "companyName"],
        ],
      },
      include: [
        {
          model: Store,
          attributes: [],
          where: { ...storeFilter },
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
    const editData = { ...data }

    const logger = await Logger.findByPk(id)
    if (!logger) {
      throw new NotFoundError("Không tìm thấy logger cần chỉnh sửa!")
    }
    return await logger.update(editData)
  }

  static async delete(id, force) {
    const logger = await Logger.findByPk(id, { paranoid: !force })
    if (!logger) {
      throw new NotFoundError("Không tìm thấy logger cần xóa!")
    }
    await logger.destroy({ force: Boolean(force) })
  }

  static async restore(id) {
    const logger = await Logger.findByPk(id, { paranoid: false })
    if (!logger) {
      throw new NotFoundError("Không tìm thấy logger cần khôi phục!")
    }
    await logger.restore()
  }
}

module.exports = LoggerService
