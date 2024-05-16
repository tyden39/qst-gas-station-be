const { Types } = require('mongoose')
const keytokenModel = require('../models/keytoken.model')

class KeyTokenService {
  static createKeyToken = async ({ userId, privateKey, publicKey, refreshToken }) => {
    try {
      const filter = { user: userId },
            update = { publicKey, privateKey, refreshtokenUsed: [], refreshToken},
            option = { upsert: true, new: true} 

      const tokens = await keytokenModel.findOneAndUpdate(filter, update, option)
      return tokens ? tokens : null
    } catch (error) {
      return error
    }
  }

  static findByPropertyName = async (propName, value, lean = true) => {
    let propValue
    switch (propName) {
      case 'user':
        propValue = new Types.ObjectId(value)
        break;
    
      default:
        propValue = value
        break;
    }

    const condition = {}
    condition[propName] = propValue

    const keyToken = keytokenModel.findOne(condition)
    if (lean)
      return await keyToken.lean()
    return await keyToken
  }

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteMany(id)
  }
}

module.exports = KeyTokenService
