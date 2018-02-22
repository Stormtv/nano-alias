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

router.post('/avatar', (req, res) => {
  Alias
    .getAvatar(req.body)
    .then((avatar) => {
      res
        .status(200)
        .json({
          'status': 'SUCCESS',
          'message': 'Successfully found the avatar of the alias',
          'data': {
            'avatar': avatar
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

router.post('/registerPhone', (req, res) => {
  Alias
    .registerPhone(req.body)
    .then((alias) => {
      res
        .status(200)
        .json({
          'status': 'SUCCESS',
          'message': 'Successfully registered the SMS with the alias',
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

router.post('/registerAddress', (req, res) => {
  Alias
    .registerAddress(req.body)
    .then((alias) => {
      res
        .status(200)
        .json({
          'status': 'SUCCESS',
          'message': 'Successfully registered the address with the alias',
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
    .findAll(req.body)
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
