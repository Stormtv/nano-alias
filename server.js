// Packages
const express = require('express');
const config = require('./config.json');
const app = express();
const bodyParser = require('body-parser');
const models = require('./models');

// Application config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const alias = require('./routes/alias');
const request = require('./routes/request');

// Set routes
app.use('/alias', alias);
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
models.sequelize.sync().then(function () {
  app.listen(config.system.port);
});
console.log('Listening on port: ' + config.system.port);