const express = require('express');
const router = express.Router();
const Address = require('../services/address');

router.get('/:address', (req, res) => {
  Address
    .find(req.params.address)
    .then((aliases) => {
      res
        .status(200)
        .json({
          'status': 'SUCCESS',
          'message': 'Successfully found aliases of the address',
          'data': {
            'aliases': aliases
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