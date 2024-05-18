'use strict'

const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokens, verifyJWT, createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError, NotFoundError, UnauthorizedError, ForbiddenError } = require('../core/error.response')
const {findByEmail} = require('./user.service')

const roleUser = {
  ADMIN: '00001',
  STORE_ADMIN: '00002',
  READ: '00003',
  WRITE: '00004',
}

class AccessService {
  // static handleRefreshToken = async ({refreshToken}) => {
  //   const foundTokenUsed = await KeyTokenService.findByPropertyName('refreshTokenUsed', refreshToken)

  //   if (foundTokenUsed) {
  //     const {privateKey, publicKey} = foundTokenUsed
  //     const { userId, email } = verifyJWT(refreshToken, privateKey)
  //     // console.log(userId, email)
  //     // console.log(await KeyTokenService.removeKeyById({user: new mongoose.Types.ObjectId(userId)}))
  //     throw new ForbiddenError('Something wrong happen! Please re-login!')
  //   }

  //   const holderToken = await KeyTokenService.findByPropertyName('refreshToken', refreshToken, false)
  //   if (!holderToken) throw new UnauthorizedError('User is not registered')

  //   const { userId, email } = verifyJWT(refreshToken, holderToken.privateKey)

  //   const foundUser = await findByEmail({email})
  //   if (!foundUser) throw new UnauthorizedError('User is not registered')

  //   const tokens = await createTokenPair({userId, email}, holderToken.publicKey, holderToken.privateKey)

  //   await holderToken.updateOne({
  //     $set: {
  //       refreshToken: tokens.refreshToken
  //     },
  //     $addToSet: {
  //       refreshTokenUsed: refreshToken
  //     }
  //   })

  //   return {
  //     user: {userId, email},
  //     tokens
  //   }
  // }

  static logout = async ({ keyStore }) => {
    return await KeyTokenService.removeKeyById(keyStore.id)
  }

  static login = async ({email, password, refreshToken = null}) => {
    // check email
    const foundUser = await findByEmail({email})
    if(!foundUser) throw new UnauthorizedError('User not registered!')

    // check password
    const passwordMatch = await bcrypt.compare(password, foundUser.password)
    if (!passwordMatch) throw new UnauthorizedError('Invalid password')
    
    // create token
    const tokens = await createTokens({user: foundUser})

    return {
      user: getInfoData({fields: ['id', 'name', 'email'], object: foundUser}),
      tokens
    }
  }

  static signUp = async ({ name, email, password }) => {
    const holderUser = await User.findOne({ where: {email} }) // why don't use service (current is model)
    if (holderUser) {
      throw new BadRequestError('Error: User already registed!')
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = await User.create({
      name,
      email,
      password: passwordHash,
      roles: JSON.stringify([roleUser.ADMIN]),
    })

    if (newUser) {
      const tokens = await createTokens({user: newUser})

      return {
        user: getInfoData({
          fields: ['id', 'email', 'name'],
          object: newUser,
        }),
        tokens,
      }
    }
  }
}

module.exports = AccessService
