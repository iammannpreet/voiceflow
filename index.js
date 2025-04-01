const app = require('./app')
const config = require('./config')

const server = app.listen(config.port, '0.0.0.0', function () {
  console.log('Express server listening on port ' + server.address().port)
})

module.exports = server
