const placesData = require('./data');
const assert = require('assert');

describe('Place/data', () => {

    it('shouldreturn an array of place', () => {

        placesData.getPlacesAsync().then(function(places){
            assert.ok(Array.isArray(places));
        });

      
    });
});
