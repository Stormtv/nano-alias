const rp = require('request-promise-native');
const Alias = require('./services/alias');
let results = [];
let methods = {};
methods.importAliases = () => {
    let options = {
      uri: "https://www.nanode.co/api/alias/all",
      method: "GET",
      json:true
    };
    rp(options).then((results) => {
      for (let i = 0; i < results.length; i++) {
        results[i].address = results[i].account;
        Alias
          .reserveAlias(results[i])
          .then((alias) => {
            // console.log({
            //     'status': 'SUCCESS',
            //     'message': 'Successfully reserved alias',
            //     'data': {
            //       'alias': alias
            //     }
            //   });
          })
          .catch((err) => {
            // console.log({
            //     'status': 'ERROR',
            //     'message': err
            //   });
          });
      }
    }).catch((err) => {
      console.log(err);
    });
}
module.exports = methods;