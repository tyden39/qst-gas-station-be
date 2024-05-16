const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3010
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    user: process.env.DEV_DB_USER || 'root',
    password: process.env.DEV_DB_PASSWORD || 'root',
    name: process.env.DEV_DB_NAME || 'qst_gas_station',
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
  }
}

const config = { dev, prod }
const env = process.env.NODE_ENV || 'dev'

module.exports = config[env]