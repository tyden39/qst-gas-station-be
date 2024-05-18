const app = require('./src/app')
const { app: { port }} = require('./src/configs/config.server')

const server = app.listen(port, () =>
  console.log(`WSV eCommerce start with port ${port}`)
)

process.on('SIGINT', () => {
  server.close(() => {
    console.log(`Exit server Express`)
  })
})
