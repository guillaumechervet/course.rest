// https://www.npmjs.com/package/fast-json-patch
var jsonpatch = require('fast-json-patch');

var document = { firstName: 'Albert', contactDetails: { phoneNumbers: [] } };
var patch = [
    { op: 'replace', path: '/firstName', value: 'Joachim' },
    { op: 'add', path: '/lastName', value: 'Wester' },
    {
        op: 'add',
        path: '/contactDetails/phoneNumbers/0',
        value: { number: '555-123' }
    }
];
document = jsonpatch.applyPatch(document, patch).newDocument;
// document == { firstName: "Joachim", lastName: "Wester", contactDetails: { phoneNumbers: [{number:"555-123"}] } }
