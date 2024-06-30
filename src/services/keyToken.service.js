const KeyToken = require("../models/keytoken.model")

class KeyTokenService {
  static createKeyToken = async ({ userId, roles, companyId, branchId, storeId, accessToken, refreshToken }) => {
    try {
      const [tokens] = await KeyToken.upsert(
        {
          user: userId,
          roles,
          companyId, branchId, storeId, 
          refreshtokenUsed: [],
          refreshToken,
          accessToken,
        },
        {
          returning: true,
        }
      )
      return tokens
        ? { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }
        : null
    } catch (error) {
      return error
    }
  }

  static findByPropertyName = async (propName, value) => {
    let propValue
    switch (propName) {
      default:
        propValue = value
        break
    }

    const condition = {}
    condition[propName] = propValue

    const keyToken = await KeyToken.findOne({ where: condition })

    return keyToken
  }

  static removeKeyById = async (id) => {
    return await KeyToken.destroy({ where: { id }, force: true })
  }
}

module.exports = KeyTokenService
