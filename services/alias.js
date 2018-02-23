const models = require('../models');
const xrbRegex = /((?:xrb_[13][a-km-zA-HJ-NP-Z0-9]{59})|(?:nano_[13][a-km-zA-HJ-NP-Z0-9]{59}))/;
/*
  XRegExp Allows us to check the unicode category and
  ensure it is a letter regardless of language.
*/
const XRegExp = require('xregexp');
const letterRegex = XRegExp('^\\p{Ll}+$');
const lnRegex = XRegExp('^(\\p{Ll}|\\pN)+$');
const numberRegex = /^(\+[0-9]{1,3}|0)[0-9]{3}( ){0,1}[0-9]{7,8}\b/;
const crypto = require('crypto');
const jdenticon = require('jdenticon');
const Datauri = require('datauri');
const config = require('../config.json');
const twilio = require('twilio');
const moment = require('moment');
const signature = require('./signature');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const CodeService = require('./code');
let client = new twilio(config.twilioSID, config.twilioAuthToken);
let methods = {};

const encryptEmail = (data) => {
  if (data) {
    var cipher = crypto.createCipher('aes-256-cbc', config.privateKey);
    var crypted = cipher.update(data, 'utf-8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  } else {
    return "";
  }
};

const hashAvatar = (alias,address) => {
  return crypto.createHmac('sha256', config.privateKey).update(alias+address).digest('hex');
};

const random = (howMany, chars) => {
  chars = chars || "0123456789";
  let rnd = crypto.randomBytes(howMany),
    value = new Array(howMany),
    len = chars.length;
  for (let i = 0; i < howMany; i++) {
    value[i] = chars[rnd[i] % len];
  }
  return value.join('');
};

methods.create = (data) => {
  return new Promise((resolve, reject) => {
    if (!data.address) {
      reject('No address provided');
    }
    if (typeof data.address !== 'string' && xrbRegex.test(data.address)) {
      reject('Invalid address provided');
    }
    if (!data.email) {
      reject('No email provided');
    }
    if (typeof data.email !== 'string') {
      reject('Invalid email provided');
    }
    if (!data.listed) {
      data.listed = false;
    }
    if (data.listed && typeof data.listed === 'string' &&
      !(data.listed === "true" || data.listed === "false")) {
      reject('Invalid listed provided');
    } else {
      data.listed = data.listed == 'true';
    }
    if (!data.alias) {
      reject('No alias provided');
    }
    if (typeof data.alias !== 'string') {
      reject('Invalid alias provided');
    }
    data.phoneRegistered = true;
    if (!letterRegex.test(data.alias.charAt(0))) {
      //Not a valid alias is this a valid phone number?
      if (!numberRegex.test(data.alias)) {
        //Not a valid phone alias
        reject('Invalid alias format: must be E164 phone number or must start with a Unicode Letter');
      } else {
        //Valid phone number - Never List Phone Numbers
        data.phoneRegistered = false;
        data.listed = false;
      }
    } else if (!lnRegex.test(data.alias)) {
      reject('Invalid alias format: must start with a Unicode Letter & only contain unicode letters or symbols');
    }
    if (data.alias.length < 4) {
      reject('Aliases must be at least 4 characters in length aliases of 3 character and less are reserved');
    }
    if (!data.signature) {
      reject('No signature provided');
    }
    if (typeof data.signature !== 'string') {
      reject('Invalid signature provided');
    }
    data.addressRegistered = false;
    if (signature.verify(data.signature, [data.alias.toLowerCase(), data.address], data.address)) {
      data.addressRegistered = true;
    } else {
      reject(`Couldn't Verify Signature`);
    }
    methods
      .find(data.alias.toLowerCase())
      .then((alias) => {
        reject(`${data.alias} has already been taken!`);
      })
      .catch((err) => {
        if (err === 'Could not find alias') {
          data.email = encryptEmail(data.email);
          let currentAlias = data.alias.toLowerCase();
          data.alias = data.alias.toLowerCase();
          if (data.listed === false) {
            data.alias = crypto.createHmac('sha256', config.privateKey).update(data.alias).digest('hex');
          }
          crypto.randomBytes(8, (err, buf) => {
            if (err) reject(err);
            let formData = {
              alias: data.alias.toLowerCase(),
              address: data.address,
              email: data.email,
              seed: crypto.createHmac('sha256', config.privateKey).update(buf.toString('hex')).digest('hex'),
              listed: data.listed,
              addressRegistered: data.addressRegistered,
              phoneRegistered: data.phoneRegistered
            };
            if (data.signature && typeof data.signature === 'string') {
              formData.signature = data.signature;
            }
            models.alias
              .create(formData)
              .then((alias) => {
                if (alias.dataValues.phoneRegistered === false) {
                  let code = random(6);
                  return CodeService.create({
                    id: alias.dataValues.id,
                    code: code
                  })
                  .then((code) => {
                    if (config.twilioEnabled) {
                      client.messages.create({
                          body: `Nano Alias: ${code.dataValues.code} is your SMS verification code.`,
                          to: currentAlias,
                          from: config.twilioPhoneNumber
                      })
                      .then((message) => {
                        alias.dataValues.avatar = jdenticon.toSvg(hashAvatar(currentAlias,alias.dataValues.address), 64);
                        alias.dataValues.alias = currentAlias;
                        delete alias.dataValues.email;
                        resolve(alias.dataValues);
                      })
                      .catch((err) => {
                        reject(err);
                      });
                    } else {
                      alias.dataValues.avatar = jdenticon.toSvg(hashAvatar(currentAlias,alias.dataValues.address), 64);
                      alias.dataValues.alias = currentAlias;
                      delete alias.dataValues.email;
                      resolve(alias.dataValues);
                    }
                  })
                  .catch((err) => {
                    reject(err);
                  });
                } else {
                  alias.dataValues.avatar = jdenticon.toSvg(hashAvatar(currentAlias,alias.dataValues.address), 64);
                  alias.dataValues.alias = currentAlias;
                  delete alias.dataValues.email;
                  delete alias.dataValues.phoneRegistered;
                  resolve(alias.dataValues);
                }
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
      reject('No alias provided');
    }
    if (typeof data.alias !== 'string') {
      reject('Invalid alias provided');
    }
    if (!letterRegex.test(data.alias.charAt(0))) {
      //Not a valid alias is this a valid phone number?
      if (!numberRegex.test(data.alias)) {
        //Not a valid phone alias
        reject('Invalid alias format: must be E164 phone number or must start with a Unicode Letter');
      }
    } else if (!lnRegex.test(data.alias)) {
      reject('Invalid alias format: must start with a Unicode Letter & only container unicode letters or symbols');
    }
    if (!data.privateSignature) {
      reject('No private signature provided');
    }
    if (typeof data.privateSignature !== 'string') {
      reject('Invalid private signature provided');
    }
    try {
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
            ]
          }
        })
        .then((alias) => {
          if (signature.verify(data.privateSignature, [data.alias.toLowerCase(), alias.address, alias.seed], alias.address) === true) {
            alias.destroy()
              .then(() => {
                resolve('Deleted ' + data.alias.toLowerCase());
              })
              .catch((err) => { reject(err); });
          } else {
            reject('Could not verify privateSignature');
          }
          resolve(alias.dataValues);
        })
        .catch((err) => {
          reject(err);
        });
    } catch(err) {
      reject('Invalid Alias Seed');
    }
  });
};

methods.edit = (data) => {
  return new Promise((resolve, reject) => {
    if (!data.alias) {
      reject('No alias provided');
    }
    if (typeof data.alias !== 'string') {
      reject('Invalid alias provided');
    }
    if (!letterRegex.test(data.alias.charAt(0))) {
      //Not a valid alias is this a valid phone number?
      if (!numberRegex.test(data.alias)) {
        //Not a valid phone alias
        reject('Invalid alias format: must be E164 phone number or must start with a Unicode Letter');
      }
    } else if (!lnRegex.test(data.alias)) {
      reject('Invalid alias format: must start with a Unicode Letter & only container unicode letters or symbols');
    }
    if (!data.privateSignature) {
      reject('No private signature provided');
    }
    if (typeof data.privateSignature !== 'string') {
      reject('Invalid private signature provided');
    }
    if (!data.address) {
      reject('No address provided');
    }
    if (typeof data.address !== 'string' && xrbRegex.test(data.address)) {
      reject('Invalid address provided');
    }
    try {
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
            address: data.address
          }
        })
        .then((alias) => {
          if (signature.verify(data.privateSignature, [data.alias.toLowerCase(), alias.address, alias.seed], alias.address) === true) {
            //Check if editing listed first
            if (data.listed !== null && typeof data.listed === 'string' && (data.listed === "true" || data.listed === "false")) {
              alias.listed = data.listed;
            }

            //Invalidating the signature should occur if alias or address changes.
            let invalidateSignature = false;

            //Check if editing alias second
            let currentAlias = null;
            if (data.newAlias !== null && typeof data.newAlias === 'string' &&
              ((letterRegex.test(data.newAlias.charAt(0)) && lnRegex.test(data.newAlias)) || numberRegex.test(data.newAlias)) &&
              data.newAlias.length >= 4) {
                invalidateSignature = true;
                if (numberRegex.test(data.newAlias)) {
                  //Phone Numbers are always unlisted and must be re-registered
                  alias.listed = false;
                  alias.phoneRegistered = false;
                } else {
                  //Changed from phone number to shortcode
                  alias.phoneRegistered = true;
                }
                if (alias.listed === false) {
                  //Hash unlisted aliases
                  alias.alias = crypto.createHmac('sha256', config.privateKey).update(data.newAlias.toLowerCase()).digest('hex');
                } else {
                  //Always use lowercase values | regex should reject it but just in case ;)
                  alias.alias = data.newAlias.toLowerCase();
                }
                currentAlias = data.newAlias.toLowerCase();
            } else {
              currentAlias = data.alias.toLowerCase();
            }

            //Check if editing address third & validate ownership of that address
            if (data.newAddress !== null && typeof data.newAddress === 'string' && xrbRegex.test(data.newAddress)) {
              alias.address = data.newAddress;
              invalidateSignature = true;
              alias.addressRegistered = false;
            }

            //Validate Ownership of address and edit the alias signature
            if (invalidateSignature === true) {
              if (data.newSignature !== null && typeof data.newSignature === 'string') {
                if (signature.verify(data.newSignature, [currentAlias, alias.address], alias.address) === true) {
                  alias.addressRegistered = true;
                  alias.signature = data.newSignature;
                } else {
                  return reject("Unable to verify New Signature for the edited values, You are not allowed to edit without a valid signature as you would lose your alias.")
                }
              } else {
                return reject("New signature was not provided or was invalid")
              }
            }

            //Email fourth
            if (data.email !== null && typeof data.email === 'string') {
              alias.email = encryptEmail(data.email);
            }

            crypto.randomBytes(8, (err, buf) => {
              if (err) reject(err);
              //Verification is always removed on edit
              alias.verified = false;
              //Seed is always regenerated after any edits so any future privateSignatures are different and can't be replayed!
              alias.seed = crypto.createHmac('sha256', config.privateKey).update(buf.toString('hex')).digest('hex');
              alias.save()
              .then((updatedAlias) => {
                //Send new verfication code
                if (updatedAlias.dataValues.phoneRegistered === false) {
                  let code = random(6);
                  return CodeService.create({
                    id: updatedAlias.dataValues.id,
                    code: code
                  })
                  .then((code) => {
                    if (config.twilioEnabled) {
                      client.messages.create({
                          body: `Nano Alias: ${code.dataValues.code} is your SMS verification code.`,
                          to: currentAlias,
                          from: config.twilioPhoneNumber
                      })
                      .then((message) => {
                        updatedAlias.dataValues.avatar = jdenticon.toSvg(hashAvatar(currentAlias,updatedAlias.dataValues.address), 64);
                        updatedAlias.dataValues.alias = currentAlias;
                        delete updatedAlias.dataValues.email;
                        resolve(updatedAlias.dataValues);
                      })
                      .catch((err) => {
                        reject(err);
                      });
                    } else {
                      updatedAlias.dataValues.avatar = jdenticon.toSvg(hashAvatar(currentAlias,updatedAlias.dataValues.address), 64);
                      updatedAlias.dataValues.alias = currentAlias;
                      delete updatedAlias.dataValues.email;
                      resolve(updatedAlias.dataValues);
                    }
                  })
                  .catch((err) => {
                    reject(err);
                  });
                } else {
                  updatedAlias.dataValues.alias = currentAlias;
                  updatedAlias.dataValues.avatar = jdenticon.toSvg(hashAvatar(currentAlias,updatedAlias.dataValues.address), 64);
                  delete updatedAlias.dataValues.phoneRegistered;
                  delete updatedAlias.dataValues.email;
                  resolve(updatedAlias.dataValues);
                }
              })
              .catch((err) => { reject(err); });
            });
          } else {
            reject('Could not verify privateSignature');
          }
        })
        .catch((err) => {
          reject(err);
        });
    } catch(err) {
      reject('Invalid Alias Seed');
    }
  });
};

methods.find = (aliasName) => {
  return new Promise((resolve, reject) => {
    if (!aliasName) {
      reject('No alias was provided');
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
        if (!alias) { reject('Could not find alias'); }
        if (alias.dataValues.phoneRegistered === false) {
          if (moment().diff(moment(alias.dataValues.updatedAt), "minutes") >= 10) {
            alias.destroy()
              .then(() => {
                reject('Could not find alias');
              })
              .catch((err) => { reject(err); });
          } else {
            reject(`${aliasName.toLowerCase()} is still pending registration for ${10 - moment().diff(moment(alias.dataValues.updatedAt), "minutes")} minutes`);
          }
        }
        let result = alias.dataValues;
        result.alias = aliasName.toLowerCase();
        result.avatar = jdenticon.toSvg(hashAvatar(aliasName.toLowerCase(),result.address), 64);
        delete result.email;
        delete result.seed;
        delete result.addressRegistered;
        delete result.phoneRegistered;
        resolve(result);
      })
      .catch((err) => { reject(err); });
  });
};

methods.getAvatar = (data) => {
  return new Promise((resolve, reject) => {
    if (!data.alias) {
      reject('No alias was provided');
    }
    let size = 64;
    if (data.size) {
      size = data.size;
    }
    let svg = true;
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
          addressRegistered: true,
          phoneRegistered: true
        }
      })
      .then((alias) => {
        if (!alias) { reject('Could not find alias'); }
        if (svg === true) {
          resolve(jdenticon.toSvg(hashAvatar(data.alias.toLowerCase(),alias.dataValues.address), parseInt(data.size)));
        } else {
          let buffer = jdenticon.toPng(hashAvatar(data.alias.toLowerCase(),alias.dataValues.address), parseInt(data.size));
          const datauri = new Datauri();
          datauri.format('.png', buffer);
          resolve(datauri.base64);
        }
      })
      .catch((err) => { reject(err); });
  });
};

methods.findAll = (data) => {
  return new Promise((resolve, reject) => {
    if (!data.page || data.page === null) {
      data.page = 0;
    }
    if (!data.text || data.text === null) {
      data.text = "";
    }
    models.alias
      .findAll(
        {
          offset:data.page*10,
          limit:10,
          where: {
            listed:true,
            addressRegistered:true,
            phoneRegistered:true,
            alias: {
              [Op.like]: '%'+data.text+'%'
            }
          }
        }
      )
      .then((aliases) => {
        if (!aliases) { reject('Could not get aliases'); }
        let results = [];
        aliases.forEach((alias) => {
          let result = alias.dataValues;
          result.avatar = jdenticon.toSvg(hashAvatar(result.alias,result.address), 64);
          delete result.email;
          delete result.seed;
          delete result.addressRegistered;
          delete result.phoneRegistered;
          results.push(result);
        });
        resolve(results);
      })
      .catch((err) => { reject(err); });
  });
};

methods.registerPhone = (data) => {
  return new Promise((resolve, reject) => {
    if (!data.alias) {
      reject('No alias provided');
    }
    if (!data.verifyCode) {
      reject('No verification code was provided');
    }
    models.alias
      .findOne({
        include: [{
          model: models.code,
          as: 'codes',
          where: {
            '$codes.code$': data.verifyCode
          }
        }],
        where: {
          $or: [
            {
              alias: data.alias.toLowerCase()
            },
            {
              alias: crypto.createHmac('sha256', config.privateKey).update(data.alias.toLowerCase()).digest('hex')
            }
          ]
        }
      })
      .then((alias) => {
        if (!alias) { reject('Could not find an alias with provided alias and verfication code'); }
        //TODO Should we delete codes on invalid registration and force a new registration?
        //Could open a vulnerability with bruteforcing registration codes?
        if (alias.codes.length > 0 && moment().diff(moment(alias.codes[0].createdAt), "minutes") < 10) {
          return alias.codes[0].destroy()
            .then((destroyedCode) => {
              //SUCCESSFULLY VERIFIED
              alias.phoneRegistered = true;
              delete alias.codes;
              return alias.save()
              .then((updatedAlias) => {
                updatedAlias.dataValues.alias = data.alias;
                updatedAlias.dataValues.avatar = jdenticon.toSvg(hashAvatar(data.alias,updatedAlias.dataValues.address), 64);
                delete updatedAlias.dataValues.codes;
                delete updatedAlias.dataValues.email;
                delete updatedAlias.dataValues.seed;
                delete updatedAlias.dataValues.addressRegistered;
                delete updatedAlias.dataValues.phoneRegistered;
                resolve(updatedAlias.dataValues);
              })
              .catch((err) => { reject(err); });
            })
            .catch((err) => { reject(err); });
        } else {
          if (alias.codes.length > 0) {
            alias.codes[0].destroy()
              .then((destroyedCode) => {
                delete alias.dataValues.codes;
                reject(`The verification code has expired for ${data.alias}`);
              })
              .catch((err) => { reject(err); });
          }
        }
      })
      .catch((err) => { reject(err); });
  });
};

module.exports = methods;
