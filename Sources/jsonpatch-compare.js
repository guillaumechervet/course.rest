// https://www.npmjs.com/package/fast-json-patch
var jsonpatch = require('fast-json-patch');

var documentA = { user: { firstName: 'Asddssdbert', lastName: 'Einstein' } };
var documentB = { user: { firstName: 'Albert', lastName: 'Collins' } };
var diff = jsonpatch.compare(documentA, documentB);

// Result
console.log(diff);
