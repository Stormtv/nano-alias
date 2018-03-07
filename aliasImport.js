const rp = require('request-promise-native');
const Alias = require('./services/alias');
let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
let results = [];
let methods = {};
let count = alphabet.length;
let handleNanodeResponse = (aliases,letter) => {
  if (aliases.length >= 20) {
    count+=alphabet.length-1;
    for (let i = 0; i < alphabet.length; i++) {
      let newLetter = letter+alphabet[i];
      let options = {
        uri: "https://www.nanode.co/api/alias/lookup?id="+newLetter,
        method: "GET",
        json:true
      };
      rp(options).then((aliases) => {
        handleNanodeResponse(aliases,newLetter);
      }).catch((err) => {
        console.log(err);
      });
    }
  } else {
    count--;
    for (let n = 0; n < aliases.length; n++) {
      results.push(aliases[n]);
    }
    if (count === 0) {
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
    }
  }
};
methods.importAliases = () => {
  for (let i = 0; i < alphabet.length; i++) {
    let letter = alphabet[i];
    let options = {
      uri: "https://www.nanode.co/api/alias/lookup?id="+letter,
      method: "GET",
      json:true
    };
    rp(options).then((aliases) => {
      handleNanodeResponse(aliases,letter);
    }).catch((err) => {
      console.log(err);
    });
  }
}
module.exports = methods;