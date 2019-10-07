// Packages
const nacl = require('tweetnacl/nacl'); //We are using a forked version of tweetnacl, so need to import nacl
const blake = require('blakejs');

// Arrays manipulations
function uint8_uint4 (uint8) {
  var length = uint8.length
  var uint4 = new Uint8Array(length * 2)
  for (let i = 0; i < length; i++) {
    uint4[i * 2] = uint8[i] / 16 | 0
    uint4[i * 2 + 1] = uint8[i] % 16
  }
  return uint4
}

function uint4_uint8 (uint4) {
  var length = uint4.length / 2
  var uint8 = new Uint8Array(length)
  for (let i = 0; i < length; i++)	uint8[i] = uint4[i * 2] * 16 + uint4[i * 2 + 1]
  return uint8
}

function uint5_uint4 (uint5) {
  var length = uint5.length / 4 * 5
  var uint4 = new Uint8Array(length)
  for (let i = 1; i <= length; i++) {
    let n = i - 1
    let m = i % 5
    let z = n - ((i - m) / 5)
    let right = uint5[z - 1] << (5 - m)
    let left = uint5[z] >> m
    uint4[n] = (left + right) % 16
  }
  return uint4
}

function string_uint5 (string) {
  var letter_list = letter_list = '13456789abcdefghijkmnopqrstuwxyz'.split('')
  var length = string.length
  var string_array = string.split('')
  var uint5 = new Uint8Array(length)
  for (let i = 0; i < length; i++)	uint5[i] = letter_list.indexOf(string_array[i])
  return uint5
}

function hex_uint8 (hex) {
  var length = (hex.length / 2) | 0
  var uint8 = new Uint8Array(length)
  for (let i = 0; i < length; i++) uint8[i] = parseInt(hex.substr(i * 2, 2), 16)
  return uint8
}

function uint8_hex (uint8) {
  var hex = ''
  for (let i = 0; i < uint8.length; i++)	{
    aux = uint8[i].toString(16).toUpperCase()
    if (aux.length == 1) { aux = '0' + aux }
    hex += aux
    aux = ''
  }
  return (hex)
}

function uint4_hex (uint4) {
  var hex = ''
  for (let i = 0; i < uint4.length; i++) hex += uint4[i].toString(16).toUpperCase()
  return (hex)
}

function equal_arrays (array1, array2) {
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] != array2[i])	return false
  }
  return true
}

function array_crop (array) {
  var length = array.length - 1
  var cropped_array = new Uint8Array(length)
  for (let i = 0; i < length; i++) { cropped_array[i] = array[i + 1] }
  return cropped_array
}

function keyFromAccount(account) {
  if ((account.startsWith('xrb_1') || account.startsWith('xrb_3') || account.startsWith('nano_1') || account.startsWith('nano_3')) && (account.length == 64)) {
    var account_crop = account.substring(4, 64)
    var isValid = /^[13456789abcdefghijkmnopqrstuwxyz]+$/.test(account_crop)
    if (isValid) {
      var key_uint4 = array_crop(uint5_uint4(string_uint5(account_crop.substring(0, 52))))
      var hash_uint4 = uint5_uint4(string_uint5(account_crop.substring(52, 60)))
      var key_array = uint4_uint8(key_uint4)
      var blake_hash = blake.blake2b(key_array, null, 5).reverse()
      if (equal_arrays(hash_uint4, uint8_uint4(blake_hash))) {
        var key = uint4_hex(key_uint4)
        return key
      }			else				{ throw 'Checksum incorrect.' }
    }		else			{ throw 'Invalid XRB/Nano account.' }
  }
  throw 'Invalid XRB/Nano account.'
}

function signature(fields, secretKey) {
  let context = blake.blake2bInit(32, null)
  for (let i = 0; i < fields.length; i++) {
    blake.blake2bUpdate(context, hex_uint8(fields[i]));
  }
  let hash = uint8_hex(blake.blake2bFinal(context));
  return uint8_hex(nacl.sign.detached(hex_uint8(hash), hex_uint8(secretKey)));
}

function verify(signature, fields, publicKey) {
  let context = blake.blake2bInit(32, null)
  for (let i = 0; i < fields.length; i++) {
    blake.blake2bUpdate(context, hex_uint8(fields[i]));
  }
  let hash = uint8_hex(blake.blake2bFinal(context))
  let kfa = keyFromAccount(publicKey)
  return nacl.sign.detached.verify(hex_uint8(hash), hex_uint8(signature), hex_uint8(kfa))
}

module.exports = {
  signature: signature,
  verify: verify
}