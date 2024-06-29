"use strict"

const JWT = require("jsonwebtoken")
const crypto = require("crypto")
const KeyTokenService = require("../services/keyToken.service")
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../core/error.response")
const asyncHandler = require("../helpers/asyncHandler")
const fs = require('fs');

const HEADER = {
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
}

const createTokenPair = async (payload) => {

  const publicKey = await fs.readFileSync('./public.pem', 'utf8');
  const privateKey = await fs.readFileSync('./private.pem', 'utf8');
  try {
    // JWT.sign is not async function why use await?
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
    })

    // const refreshToken = await JWT.sign(payload, privateKey, {
    //   algorithm: "ES256",
    // })
    const refreshToken = ''

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`JWT verify error::`, err)
      } else {
        // console.log(`JWT verify::`, "success")
      }
    })

    return { accessToken, refreshToken }
  } catch (error) {
    console.log("createTokenPair error::", error.message)
  }
}

const createTokens = async ({ user }) => {

  const publicKey = await fs.readFileSync('./public.pem', 'utf8');
  const privateKey = await fs.readFileSync('./private.pem', 'utf8');
  const userId = user.id

  const tokens = await createTokenPair({ userId, username: user.username })

  const saveTokens = await KeyTokenService.createKeyToken({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    userId,
  })

  return saveTokens
}

const createCompanyTokens = async ({ companyId, companyName }) => {

  const token = await createTokenPair({ companyId, companyName })

  return token.accessToken
}

const authentication = asyncHandler(async (req, res, next) => {
  try {

    const publicKey = await fs.readFileSync('./public.pem', 'utf8');
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new UnauthorizedError("Invalid token")

    const decodeUser = JWT.verify(accessToken, publicKey, { algorithms: ['RS256'] })

    const keyStore = await KeyTokenService.findByPropertyName(
      "user",
      decodeUser.userId
    )
    if (!keyStore) throw new UnauthorizedError("Invalid token")

    req.keyStore = keyStore.toJSON()
    return next()
  } catch (error) {
    throw new UnauthorizedError("Invalid token")
  }
})

const verifyJWT = (token, keySecret) => {
  return JWT.verify(token, keySecret)
}

module.exports = {
  createTokenPair,
  createTokens,
  createCompanyTokens,
  authentication,
  verifyJWT,
}
