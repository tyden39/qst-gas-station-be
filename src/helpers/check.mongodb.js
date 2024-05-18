// const os = require('os')

// const CHECK_OVERLOAD_DURATION = 5000

// const countConnections = () => {
//   console.log(`Number of connections::${mongoose.connections.length}`)
// }

// const checkOverload = () => {
//   setInterval(() => {
//     const numbConnections = mongoose.connections.length
//     const numbCore = os.cpus().length
//     const memoryUsage = process.memoryUsage().rss;
//     // Example maximum number of connections based on number of cores
//     const maxConnections = numbCore * 5 - 1

//     console.log(`Active connections: ${numbConnections}`)
//     console.log(`Memory usage::${memoryUsage / 1024 / 1024} MB`)

//     if (numbConnections > maxConnections) {
//       console.log(`Connections overload detected`)
//     }
    
//   }, CHECK_OVERLOAD_DURATION);
// }

// module.exports = {
//   countConnections,
//   checkOverload
// }