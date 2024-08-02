const { PERMISSION } = require("../constants/auth/permission")

exports.getCompanyFilter = (authUser, companyId) => {
  const { ADMINISTRATOR, COMPANY, STORE, STORE_READ_ONLY, BRANCH } = PERMISSION
  switch (authUser.roles[0]) {
    case ADMINISTRATOR:
      return companyId
        ? { id: companyId }
        : authUser.companyId
        ? { id: authUser.companyId }
        : {}
    case COMPANY:
    case BRANCH:
    case STORE:
    case STORE_READ_ONLY:
    default:
      if (!authUser.companyId)
        throw new UnauthorizedError(
          `Người dùng ${authUser.username} chưa được chỉ định công ty!`
        )
      return { id: authUser.companyId }
  }
}

exports.getBranchFilter = (authUser, branchId) => {
  const { ADMINISTRATOR, COMPANY, STORE, STORE_READ_ONLY, BRANCH } = PERMISSION
  switch (authUser.roles[0]) {
    case ADMINISTRATOR:
    case COMPANY:
      return branchId ? { id: branchId } : {}
    case BRANCH:
      if (!authUser.branchId)
        throw new UnauthorizedError(
          `Người dùng ${authUser.username} chưa được chỉ định chi nhánh!`
        )
      return { id: authUser.branchId }
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
      return storeId ? { id: storeId } : {}
    case STORE:
    case STORE_READ_ONLY:
      if (!authUser.storeId)
        throw new UnauthorizedError(
          `Người dùng ${authUser.username} chưa được chỉ định cửa hàng!`
        )
      return { id: authUser.storeId }
    default:
      return {}
  }
}
