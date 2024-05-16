'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokens, verifyJWT, createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError, NotFoundError, UnauthorizedError, ForbiddenError } = require('../core/error.response')
const {findByEmail} = require('./shop.service')
const { default: mongoose } = require('mongoose')

const roleShop = {
  SHOP: '00001',
  WRITER: '00002',
  EDITOR: '00003',
  ADMIN: '00004',
}

class AccessService {
  static handleRefreshToken = async ({refreshToken}) => {
    const foundTokenUsed = await KeyTokenService.findByPropertyName('refreshTokenUsed', refreshToken)

    if (foundTokenUsed) {
      const {privateKey, publicKey} = foundTokenUsed
      const { userId, email } = verifyJWT(refreshToken, privateKey)
      // console.log(userId, email)
      console.log(await KeyTokenService.removeKeyById({user: new mongoose.Types.ObjectId(userId)}))
      throw new ForbiddenError('Something wrong happen! Please re-login!')
    }

    const holderToken = await KeyTokenService.findByPropertyName('refreshToken', refreshToken, false)
    if (!holderToken) throw new UnauthorizedError('Shop is not registered')

    const { userId, email } = verifyJWT(refreshToken, holderToken.privateKey)

    const foundShop = await findByEmail({email})
    if (!foundShop) throw new UnauthorizedError('Shop is not registered')

    const tokens = await createTokenPair({userId, email}, holderToken.publicKey, holderToken.privateKey)

    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokenUsed: refreshToken
      }
    })

    return {
      user: {userId, email},
      tokens
    }
  }

  static logout = async ({ keyStore }) => {
    return await KeyTokenService.removeKeyById(keyStore._id)
  }

  static login = async ({email, password, refreshToken = null}) => {
    // check email
    const foundShop = await findByEmail({email})
    if(!foundShop) throw new UnauthorizedError('Shop not registered!')

    // check password
    const passwordMatch = await bcrypt.compare(password, foundShop.password)
    if (!passwordMatch) throw new UnauthorizedError('Invalid password')
    
    // create token
    const tokens = await createTokens({shop: foundShop})

    return {
      user: getInfoData({fields: ['_id', 'name', 'email'], object: foundShop}),
      tokens
    }
  }

  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean() // why don't use service (current is model)
    if (holderShop) {
      throw new BadRequestError('Error: Shop already registed!')
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [roleShop.SHOP],
    })

    if (newShop) {
      const tokens = await createTokens({shop: newShop})

      return {
        shop: getInfoData({
          fields: ['_id', 'email', 'name'],
          object: newShop,
        }),
        tokens,
      }
    }
  }
}

module.exports = AccessService
