const models = require('../models');
const xrbRegex = /(xrb_[13][a-km-zA-HJ-NP-Z0-9]{59})/g;
let methods = {};

methods.create = (data) => {
  return new Promise((resolve, reject) => {
    if (!data.address) {
      return reject('No address provided');
    }
    if (typeof data.address !== 'string' && xrbRegex.test(data.address)) {
      return reject('Invalid address provided');
    }
    if (!data.email) {
      return reject('No email provided');
    }
    if (typeof data.email !== 'string') {
      return reject('Invalid email provided');
    }
    if (!data.alias) {
      return reject('No alias provided');
    }
    if (typeof data.alias !== 'string') {
      return reject('Invalid alias provided');
    }
    if (!data.text) {
      return reject('No text provided');
    }
    if (typeof data.text !== 'string') {
      return reject('Invalid text provided');
    }
    if (typeof data.text.length > 500) {
      return reject('Invalid text length must be less than or equal to 500 characters');
    }

    models.request
      .create({
        alias: data.alias.toLowerCase(),
        address: data.address,
        email: data.email,
        text: data.text
      })
      .then((request) => {
        resolve(request.dataValues);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

methods.find = (requestId) => {
  return new Promise((resolve, reject) => {
    if (!requestId) {
      return reject('No id was provided');
    }
    models.request
      .findOne({
        where: {
          id: requestId,
        }
      })
      .then((request) => {
        if (!request) { return reject('Could not find request'); }
        let result = request.dataValues;
        resolve(result);
      })
      .catch((err) => { reject(err); });
  });
};

methods.findAll = (page) => {
  return new Promise((resolve, reject) => {
    if (!page || page === null) {
      page = 0;
    }
    models.request
      .findAll({offset:page*10,limit:10})
      .then((requests) => {
        if (!requests) { return reject('Could not get requests'); }
        resolve(requests);
      })
      .catch((err) => { reject(err); });
  });
};

module.exports = methods;