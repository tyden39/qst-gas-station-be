const fs = require('fs');

const publicKey = fs.readFileSync('./public.pem', 'utf8');
const privateKey = fs.readFileSync('./private.pem', 'utf8');

const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3010,
    publicKey,
    privateKey
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    user: process.env.DEV_DB_USER || 'root',
    password: process.env.DEV_DB_PASSWORD || 'root',
    name: process.env.DEV_DB_NAME || 'qst_gas_station',
    debug: process.env.DEV_DB_DEBUG || false,
  }
}

const prod = {
  app: {
    port: process.env.PROD_APP_PORT || 3010
  },
  db: {
    host: process.env.PROD_DB_HOST || 'localhost',
    user: process.env.PROD_DB_USER || 'root',
    password: process.env.PROD_DB_PASSWORD || 'root',
    name: process.env.PROD_DB_NAME || 'qst_gas_station',
    debug: process.env.PROD_DB_DEBUG || false,
  }
}

const config = { dev, prod }
const env = process.env.NODE_ENV || 'dev'

module.exports = config[env]