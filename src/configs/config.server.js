
const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3010,
    corsOrigin: process.env.DEV_CORS_ORIGIN || 'http://localhost:3000',
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    user: process.env.DEV_DB_USER || 'root',
    password: process.env.DEV_DB_PASSWORD,
    name: process.env.DEV_DB_NAME || 'qspeco',
    debug: process.env.DEV_DB_DEBUG || false,
  }
}

const prod = {
  app: {
    port: process.env.PROD_APP_PORT || 3010,
    corsOrigin: process.env.PROD_CORS_ORIGIN || 'http://localhost:3000',
  },
  db: {
    host: process.env.PROD_DB_HOST || 'localhost',
    user: process.env.PROD_DB_USER || 'root',
    password: process.env.PROD_DB_PASSWORD,
    name: process.env.PROD_DB_NAME || 'qspeco',
    debug: process.env.PROD_DB_DEBUG || false,
  }
}

// const config = { dev, prod }
const env = process.env.NODE_ENV || 'dev'

module.exports = env === 'dev' ? dev : prod