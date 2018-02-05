const express = require('express');
const router = express.Router();
const config = require('../config.json');
const Request = require('../services/request');

router.post('/request', (req, res) => {
  Request
    .create(req.body)
    .then((request) => {
      res
        .status(200)
        .json({
          'status': 'SUCCESS',
          'message': 'Successfully created request',
          'data': {
            'request': request
          }
        });
    })
    .catch((err) => {
      res
        .status(422)
        .json({
          'status': 'ERROR',
          'message': err
        });
    });
});

router.get('/:request', (req, res) => {
  Request
    .find(req.params.request)
    .then((request) => {
      res
        .status(200)
        .json({
          'status': 'SUCCESS',
          'message': 'Successfully found the request of the id',
          'data': {
            'request': request
          }
        });
    })
    .catch((err) => {
      res
        .status(422)
        .json({
          'status': 'ERROR',
          'message': err
        });
    });
});

router.post('/', (req, res) => {
  Request
    .findAll(req.body.page)
    .then((request) => {
      res
        .status(200)
        .json({
          'status': 'SUCCESS',
          'message': 'Successfully found the requests',
          'data': {
            'request': request
          }
        });
    })
    .catch((err) => {
      res
        .status(422)
        .json({
          'status': 'ERROR',
          'message': err
        });
    });
});

module.exports = router;