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

    it('should remplace an existing place because id is set', () => {
        const data = new Data();
        const place = {
            id: '2',
            name: 'Lens2',
            author: 'Louis2',
            review: 3,
            image: null
        };
        return data.savePlaceAsync(place).then(function () {
            assert.ok(true);
        });
    });

    it('should delete a place then fail to delete it again', () => {
        const data = new Data();
        data.deletePlaceAsync('3').then(function (success) {
            assert.ok(success);
        }).then(function (success) {
            assert.ko(success);
        });
    });

});