const models = require('../models')
let methods = {}

methods.create = (data) => {
  return new Promise((resolve, reject) => {
    if (!data.id) {
      reject('No id provided')
    }
    if (typeof data.id !== 'string' && typeof data.id !== 'number') {
      reject('Invalid id provided')
    }
    if (!data.code) {
      reject('No code provided')
    }
    models.code
      .create({
        code: data.code,
        aliasId: data.id
      })
      .then((code) => {
        resolve(code)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

module.exports = methods