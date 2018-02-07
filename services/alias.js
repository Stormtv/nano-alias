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
    if (!data.listed) {
      data.listed = false;
    }
    if (data.listed && typeof data.listed !== 'boolean') {
      return reject('Invalid email provided');
    }
    if (!data.alias) {
      return reject('No alias provided');
    }
    if (typeof data.alias !== 'string') {
      return reject('Invalid alias provided');
    }
    if (data.alias.length < 4) {
      return reject('Aliases must be at least 4 characters in length aliases of 3 character and less are reserved');
    }

    models.alias
      .create({
        alias: data.alias.toLowerCase(),
        address: data.address,
        email: data.email,
        listed: data.listed
      })
      .then((alias) => {
        resolve(alias.dataValues);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

methods.find = (aliasName) => {
  return new Promise((resolve, reject) => {
    if (!aliasName) {
      return reject('No alias was provided');
    }
    models.alias
      .findOne({
        where: {
          alias: aliasName.toLowerCase(),
        }
      })
      .then((alias) => {
        if (!alias) { return reject('Could not find alias'); }
        let result = alias.dataValues;
        delete result.email;
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
    models.alias
      .findAll(
        {
          offset:page*10,
          limit:10,
          where: {
            listed:true
          }
        }
      )
      .then((aliases) => {
        if (!aliases) { return reject('Could not get aliases'); }
        let results = [];
        aliases.forEach((alias) => {
          let result = alias.dataValues;
          delete result.email;
          results.push(result);
        });
        resolve(results);
      })
      .catch((err) => { reject(err); });
  });
};

module.exports = methods;