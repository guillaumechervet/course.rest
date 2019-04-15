// https://www.npmjs.com/package/fast-json-patch
var jsonpatch = require('fast-json-patch');

var documentA = { user: { firstName: 'Albert', lastName: 'Einstein' } };
var documentB = { user: { firstName: 'Albert', lastName: 'Einstein' } };
var diff = jsonpatch.compare(documentA, documentB);

// Result
console.log(diff);
