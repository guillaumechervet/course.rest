const Data = require('./data');
const assert = require('assert');


describe('Place/data', () => {
    it('should return an array of place', () => {
        const data = new Data();
        data.getPlacesAsync().then(function (places) {
            assert.ok(Array.isArray(places));
        });
    });

    it('should get a place', () => {
        const data = new Data();
        return data.getPlaceAsync('1').then(function (place) {
            assert.equal(place.name, 'Londre');
        });
    });

    it('should save a new place', () => {
        const data = new Data();
        const place = {
            name: 'Lens',
            author: 'Louis',
            review: 3,
            image: null
        };
        return data.savePlaceAsync(place).then(function () {
            assert.notEqual(place.id, undefined);
        });
    });

    it('should delete a place', () => {
        const data = new Data();
        data.deletePlaceAsync('3').then(function () {
            assert.ok(true);
        });
    });

});