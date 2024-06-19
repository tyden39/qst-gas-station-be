const { PERMISSION } = require("../constants/auth/permission")

exports.getCompanyFilter = (authUser, companyId) => {
  const { ADMINISTRATOR, COMPANY, STORE, STORE_READ_ONLY, BRANCH } = PERMISSION
  switch (authUser.roles[0]) {
    case ADMINISTRATOR:
      return companyId
        ? { companyId }
        : authUser.companyId
        ? { companyId: authUser.companyId }
        : {}
    case COMPANY:
      if (!authUser.companyId)
        throw new UnauthorizedError(
          `Người dùng ${authUser.username} chưa được chỉ định công ty!`
        )
      return { companyId: authUser.companyId }
    case BRANCH:
    case STORE:
    case STORE_READ_ONLY:
    default:
      return {}
  }
}

exports.getBranchFilter = (authUser, branchId) => {
  const { ADMINISTRATOR, COMPANY, STORE, STORE_READ_ONLY, BRANCH } = PERMISSION
  switch (authUser.roles[0]) {
    case ADMINISTRATOR:
    case COMPANY:
      return branchId ? { branchId } : {}
    case BRANCH:
      if (!authUser.branchId)
        throw new UnauthorizedError(
          `Người dùng ${authUser.username} chưa được chỉ định chi nhánh!`
        )
      return { branchId: authUser.branchId }
    case STORE:
    case STORE_READ_ONLY:
    default:
      return {}
  }
}

exports.getStoreFilter = (authUser, storeId) => {
  const { ADMINISTRATOR, COMPANY, STORE, STORE_READ_ONLY, BRANCH } = PERMISSION

  switch (authUser.roles[0]) {
    case ADMINISTRATOR:
    case COMPANY:
    case BRANCH:
      return storeId ? { storeId } : {}
    case STORE:
    case STORE_READ_ONLY:
      if (!authUser.storeId)
        throw new UnauthorizedError(
          `Người dùng ${authUser.username} chưa được chỉ định cửa hàng!`
        )
      return { storeId: authUser.storeId }
    default:
      return {}
  }
}
