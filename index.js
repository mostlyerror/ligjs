const matchups = require('./matchups')
const args = process.argv.slice(2);

matchups(args[0], args[1])
  .then(data => { console.log(data) })
  .catch(err => { console.log(err) })
