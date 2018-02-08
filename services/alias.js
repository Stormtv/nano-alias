const models = require('../models');
const xrbRegex = /(xrb_[13][a-km-zA-HJ-NP-Z0-9]{59})/g;
/*
  XRegExp Allows us to check the unicode category and
  ensure it is a letter regardless of language.
*/
const XRegExp = require('xregexp');
const letterRegex = XRegExp('^\\pL+$');
const lnRegex = XRegExp('^(\\pL|\\pN)+$');
const numberRegex = /^(\+[0-9]{1,3}|0)[0-9]{3}( ){0,1}[0-9]{7,8}\b/;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const jdenticon = require('jdenticon');
const Datauri = require('datauri');
const config = require('../config.json');
let methods = {};

let encryptEmail = (data) => {
  if (data) {
    var cipher = crypto.createCipher('aes-256-cbc', config.privateKey);
    var crypted = cipher.update(data, 'utf-8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  } else {
    return "";
  }
};

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
    if (data.listed && typeof data.listed === 'string' &&
      !(data.listed === "true" || data.listed === "false")) {
      return reject('Invalid listed provided');
    } else {
      data.listed = data.listed == 'true';
    }
    if (!data.alias) {
      return reject('No alias provided');
    }
    if (typeof data.alias !== 'string') {
      return reject('Invalid alias provided');
    }
    data.registered = true;
    if (!letterRegex.test(data.alias.charAt(0))) {
      //Not a valid alias is this a valid phone number?
      if (!numberRegex.test(data.alias)) {
        //Not a valid phone alias
        return reject('Invalid alias format: must be E164 phone number or must start with a Unicode Letter');
      } else {
        //Valid phone number - Never List Phone Numbers
        data.registered = false;
        data.listed = false;
        //TODO BRAINBLOCKS PAYMENT TWILIO
      }
    } else if (!lnRegex.test(data.alias)) {
      return reject('Invalid alias format: must start with a Unicode Letter & only container unicode letters or symbols');
    }
    if (data.alias.length < 4) {
      return reject('Aliases must be at least 4 characters in length aliases of 3 character and less are reserved');
    }
    methods
      .find(data.alias)
      .then((alias) => {
        return reject(`${data.alias} has already been taken!`);
      })
      .catch((err) => {
        if (err === 'Could not find alias') {
          data.email = encryptEmail(data.email);
          data.alias = data.alias.toLowerCase();
          if (data.listed === false) {
            data.alias = crypto.createHmac('sha256', config.privateKey).update(data.alias).digest('hex');
          }
          crypto.randomBytes(8, (err, buf) => {
            if (err) return reject(err);
            models.alias
              .create({
                alias: data.alias.toLowerCase(),
                address: data.address,
                email: data.email,
                token: crypto.createHmac('sha256', config.privateKey).update(buf.toString('hex')).digest('hex'),
                listed: data.listed,
                registered: data.registered
              })
              .then((alias) => {
                alias.dataValues.aliasSeed = jwt.sign(alias.dataValues.token, config.privateKey);
                alias.dataValues.avatar = jdenticon.toSvg(alias.dataValues.token, 64);
                delete alias.dataValues.token;
                resolve(alias.dataValues);
              })
              .catch((err) => {
                reject(err);
              });
          });
        } else {
          reject(err);
        }
      });
  });
};

methods.delete = (data) => {
  return new Promise((resolve, reject) => {
    if (!data.alias) {
      return reject('No alias provided');
    }
    if (typeof data.alias !== 'string') {
      return reject('Invalid alias provided');
    }
    if (!letterRegex.test(data.alias.charAt(0))) {
      //Not a valid alias is this a valid phone number?
      if (!numberRegex.test(data.alias)) {
        //Not a valid phone alias
        return reject('Invalid alias format: must be E164 phone number or must start with a Unicode Letter');
      }
    } else if (!lnRegex.test(data.alias)) {
      return reject('Invalid alias format: must start with a Unicode Letter & only container unicode letters or symbols');
    }
    if (!data.aliasSeed) {
      return reject('No seed provided');
    }
    if (typeof data.aliasSeed !== 'string') {
      return reject('Invalid seed provided');
    }
    try {
      let token = jwt.verify(data.aliasSeed, config.privateKey);
      models.alias
        .destroy({
          where: {
            $or: [
              {
                alias: data.alias.toLowerCase()
              },
              {
                alias: crypto.createHmac('sha256', config.privateKey).update(data.alias.toLowerCase()).digest('hex')
              }
            ],
            token: token
          }
        })
        .then((alias) => {
          resolve(alias.dataValues);
        })
        .catch((err) => {
          reject(err);
        });
    } catch(err) {
      return reject('Invalid Alias Seed');
    }
  });
};

methods.edit = (data) => {
  return new Promise((resolve, reject) => {

    //Validate Proper Credentials to initate the edit.
    if (!data.alias) {
      return reject('No alias provided');
    }
    if (typeof data.alias !== 'string') {
      return reject('Invalid alias provided');
    }
    if (!letterRegex.test(data.alias.charAt(0))) {
      //Not a valid alias is this a valid phone number?
      if (!numberRegex.test(data.alias)) {
        //Not a valid phone alias
        return reject('Invalid alias format: must be E164 phone number or must start with a Unicode Letter');
      }
    } else if (!lnRegex.test(data.alias)) {
      return reject('Invalid alias format: must start with a Unicode Letter & only container unicode letters or symbols');
    }
    if (!data.aliasSeed) {
      return reject('No seed provided');
    }
    if (typeof data.aliasSeed !== 'string') {
      return reject('Invalid seed provided');
    }

    try {
      let token = jwt.verify(data.aliasSeed, config.privateKey);
      models.alias
        .findOne({
          where: {
            $or: [
              {
                alias: data.alias.toLowerCase()
              },
              {
                alias: crypto.createHmac('sha256', config.privateKey).update(data.alias.toLowerCase()).digest('hex')
              }
            ],
            token: token
          }
        })
        .then((alias) => {
          if (data.address !== null && typeof data.address === 'string' && xrbRegex.test(data.address)) {
            alias.address = data.address;
          }
          if (data.email !== null && typeof data.email === 'string') {
            alias.email = data.email;
          }
          if (data.listed !== null && typeof data.listed === 'string' && (data.listed === "true" || data.listed === "false")) {
            alias.listed = data.listed;
          }
          if (data.newAlias !== null && typeof data.newAlias === 'string'
            && (letterRegex.test(data.newAlias.charAt(0)) || numberRegex.test(data.newAlias))
            && data.newAlias.length >= 4) {
              if (numberRegex.test(data.newAlias)) {
                alias.listed = false;
                alias.registered = false;
                //TODO BRAINBLOCKS SEND TEXT MESSAGE
              }
              if (alias.listed === false) {
                alias.alias = crypto.createHmac('sha256', config.privateKey).update(data.newAlias).digest('hex');
              }
          }
          crypto.randomBytes(8, (err, buf) => {
            if (err) return reject(err);
            alias.token = crypto.createHmac('sha256', config.privateKey).update(buf.toString('hex')).digest('hex');
            //Everytime your account is editied you must reapply for manual verification
            alias.verified = false;
            alias.save()
            .then((updatedAlias) => {
              updatedAlias.dataValues.aliasSeed = jwt.sign(updatedAlias.dataValues.token, config.privateKey);
              updatedAlias.dataValues.avatar = jdenticon.toSvg(updatedAlias.dataValues.token, 64);
              delete updatedAlias.dataValues.token;
              resolve(updatedAlias.dataValues);
            })
          });
        })
        .catch((err) => {
          reject(err);
        });
    } catch(err) {
      return reject('Invalid Alias Seed');
    }
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
          $or: [
            {
              alias: aliasName.toLowerCase()
            },
            {
              alias: crypto.createHmac('sha256', config.privateKey).update(aliasName.toLowerCase()).digest('hex')
            }
          ]
        }
      })
      .then((alias) => {
        if (!alias) { return reject('Could not find alias'); }
        if (alias.dataValues.registered === false) {
          if (moment().diff(moment(alias.dataValues.updatedAt), "minutes") >= 10) {
            alias.destroy()
              .then(() => {
                return reject('Could not find alias');
              })
              .catch((err) => { reject(err); });
          } else {
            return reject(`${alias.dataValues.alias} is still pending registration for ${10 - moment().diff(moment(alias.dataValues.updatedAt), "minutes")} minutes`);
          }
        }
        let result = alias.dataValues;
        result.avatar = jdenticon.toSvg(result.token, 64);
        delete result.email;
        delete result.token;
        resolve(result);
      })
      .catch((err) => { reject(err); });
  });
};

methods.getAvatar = (data) => {
  return new Promise((resolve, reject) => {
    if (!data.alias) {
      return reject('No alias was provided');
    }
    let size = 64
    if (data.size) {
      size = data.size;
    }
    let svg = true
    if (data.type && data.type === "png") {
      svg = false;
    }
    models.alias
      .findOne({
        where: {
          $or: [
            {
              alias: data.alias.toLowerCase()
            },
            {
              alias: crypto.createHmac('sha256', config.privateKey).update(data.alias.toLowerCase()).digest('hex')
            }
          ],
          registered: true
        }
      })
      .then((alias) => {
        if (!alias) { return reject('Could not find alias'); }
        if (svg === true) {
          resolve(jdenticon.toSvg(alias.dataValues.token, data.size));
        } else {
          let buffer = jdenticon.toPng(alias.dataValues.token, parseInt(data.size));
          const datauri = new Datauri();
          datauri.format('.png', buffer);
          resolve(datauri.base64);
        }
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
            listed:true,
            registered:true
          }
        }
      )
      .then((aliases) => {
        if (!aliases) { return reject('Could not get aliases'); }
        let results = [];
        aliases.forEach((alias) => {
          let result = alias.dataValues;
          result.avatar = jdenticon.toSvg(result.token, 64);
          delete result.email;
          delete result.token;
          results.push(result);
        });
        resolve(results);
      })
      .catch((err) => { reject(err); });
  });
};

module.exports = methods;