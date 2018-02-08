const express = require('express');
const router = express.Router();
const config = require('../config.json');
const Alias = require('../services/alias');

router.post('/create', (req, res) => {
  Alias
    .create(req.body)
    .then((alias) => {
      res
        .status(200)
        .json({
          'status': 'SUCCESS',
          'message': 'Successfully created alias',
          'data': {
            'alias': alias
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

router.get('/:alias', (req, res) => {
  Alias
    .find(req.params.alias)
    .then((alias) => {
      res
        .status(200)
        .json({
          'status': 'SUCCESS',
          'message': 'Successfully found the address of the alias',
          'data': {
            'alias': alias
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
  Alias
    .findAll(req.body.page)
    .then((alias) => {
      res
        .status(200)
        .json({
          'status': 'SUCCESS',
          'message': 'Successfully found the aliases',
          'data': {
            'alias': alias
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

router.post('/edit', (req, res) => {
  Alias
    .edit(req.body)
    .then((alias) => {
      res
        .status(200)
        .json({
          'status': 'SUCCESS',
          'message': 'Successfully edited the aliases',
          'data': {
            'alias': alias
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

router.post('/delete', (req, res) => {
  Alias
    .delete(req.body)
    .then((alias) => {
      res
        .status(200)
        .json({
          'status': 'SUCCESS',
          'message': 'Successfully deleted the aliases',
          'data': {
            'alias': alias
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