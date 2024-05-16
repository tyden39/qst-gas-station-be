'use strict'

const JWT = require('jsonwebtoken')
const crypto = require('crypto')
const KeyTokenService = require('../services/keyToken.service')
const { BadRequestError, NotFoundError, UnauthorizedError } = require('../core/error.response')
const asyncHandler = require('../helpers/asyncHandler')

const HEADER = {
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION:  'authorization'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // JWT.sign is not async function why use await?
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '2 days',
    })

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7 days',
    })

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`JWT verify error::`, err)
      } else {
        console.log(`JWT verify::`, 'success')
      }
    })
    
    return { accessToken, refreshToken }
  } catch (error) {
    console.log('createTokenPair error::', error.message)
  }
}

const createTokens = async ({shop}) => {
  const userId = shop._id

  const privateKey = crypto.randomBytes(64).toString('hex')
  const publicKey = crypto.randomBytes(64).toString('hex')

  // create token pair
  const tokens = await createTokenPair(
    { userId, email: shop.email },
    publicKey,
    privateKey
  )
  // console.log(`Token created successfully::`, tokens)

  await KeyTokenService.createKeyToken({
    refreshToken: tokens.refreshToken,
    privateKey,
    publicKey,
    userId
  })

  return tokens
}

const authentication = asyncHandler(async (req, res, next) => {
  // check X-Client-ID
  const userId = req.headers[HEADER.CLIENT_ID]
  if(!userId) throw new BadRequestError('Invalid Request')

  // check keytoken 
  const keyStore = await KeyTokenService.findByPropertyName('user', userId)
  if (!keyStore) throw new NotFoundError('Not found KeyStore')

  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new UnauthorizedError('Invalid token')

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
    if (userId !== decodeUser.userId) throw new UnauthorizedError('Invalid UserId')
    req.keyStore = keyStore
    return next()
  } catch (error) {
    throw error
  }
})

const verifyJWT = (token, keySecret) => {
  return JWT.verify(token, keySecret)
}

module.exports = {
  createTokenPair,
  createTokens,
  authentication,
  verifyJWT,
}
