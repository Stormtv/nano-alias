const aliasSign = require('./aliasSign.js');
let secretKey = "2AF92C6F8AC53819B97D50EA23801CDB90D98941386911AAD47B797AA3DCB9DE";
let publicKey = "xrb_1poop3j1trsys99zw9eebmia45wtrqhjrgeswqjwd9x6i3rzsihrbta6mpwp";
let alias = "stormtv";
// let aliasSeed = "99c97db9f9b6b141fa076ceadbe6ad4ac9311dda903b08f509cc907c030c66ea";
console.log(aliasSign.signature([alias,publicKey],secretKey));