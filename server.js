// Packages
const express = require('express')
const config = require('./config.json')
const bodyParser = require('body-parser')
const moment = require('moment')
const models = require('./models')
const schedule = require('node-schedule')
const importer = require('./aliasImport')

// Routes
const alias = require('./routes/alias')
const request = require('./routes/request')
const address = require('./routes/address')

// Initalize Express
const app = express()

// Application config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// Set routes
app.use('/alias', alias)
app.use('/address', address)
app.use('/request', request)

app.get('/reset', (req, res) => {
  if (config.environment === 'development') {
    models.sequelize.sync({force:true});
    res
      .status(200)
      .json({
        'status': 'SUCCESS',
        'message': 'Successfully cleared database'
      })
  } else {
    res
      .status(403)
      .json({
        'status': 'ERROR',
        'message': 'Database reset is only available on development!'
      })
  }
})

//Debug Logging
app.use((req, res, next) => {
  if (config.debug) {
    console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')} - ${req.headers['x-forwarded-for'] || req.connection.remoteAddress} - ${req.method} - ${req.url}`)
  }
  if (config.environment === 'development') {
    res.header(
      'Access-Control-Allow-Origin',
      '*'
    )
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
  }
  next()
})

models.alias.hasMany(models.code)
models.sequelize.sync().then(() => {
  app.listen(config.system.port)
})

schedule.scheduleJob('30 * * * *', () => {
  importer.importAliases()
})

console.log(`Listening on port: ${config.system.port}`)