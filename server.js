// Packages
const express = require('express');
const config = require('./config.json');
const app = express();
const bodyParser = require('body-parser');
const colog = require('colog');
const moment = require('moment');
const models = require('./models');

// Application config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const alias = require('./routes/alias');
const request = require('./routes/request');
const address = require('./routes/address');

//Debug Logging
app.use(function (req, res, next) {
  if (config.debug) {
    colog.log(colog.color(moment().format('YYYY-MM-DD HH:mm:ss') + ' - ','cyan') +
              colog.color(req.headers['x-forwarded-for'] || req.connection.remoteAddress,'cyan')+
              ' - '+colog.inverse(req.method)+' - '+colog.bold(req.url));
  }
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Set routes
app.use('/alias', alias);
app.use('/address', address);
app.use('/request', request);
app.get('/reset', (req, res) => {
  if (config.environment === "development") {
    models.sequelize.sync({force:true});
    res
      .status(200)
      .json({
        'status': 'SUCCESS',
        'message': 'Successfully cleared database'
      });
  } else {
    res
      .status(403)
      .json({
        'status': 'ERROR',
        'message': 'Database reset is only available on development!'
      });
  }
});
models.alias.hasMany(models.code);
models.sequelize.sync().then(function () {
  app.listen(config.system.port);
});
console.log('Listening on port: ' + config.system.port);