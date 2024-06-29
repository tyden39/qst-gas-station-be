const bcrypt = require('bcrypt')

const abc = async () => {
  const passwordHash = await bcrypt.hash('123', 10)
  console.log(passwordHash)
}

abc()