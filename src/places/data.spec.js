const Data = require('../data');
const assert = require('assert');

describe('Place/data', () => {
    const init = () => new Data(require('./data.json'));

    it('should return an array of place', () => {
        const data = init();
        data.getAllAsync().then(function(places) {
            assert.ok(Array.isArray(places));
        });
    });

    it('should get a place', () => {
        const data = init();
        return data.getAsync('1').then(function(place) {
            assert.equal(place.name, 'Londre');
        });
    });

    it('should save a new place', () => {
        const data = init();
        const place = {
            name: 'Lens',
            author: 'Louis',
            review: 3,
            image: null
        };
        return data.saveAsync(place).then(function() {
            assert.notEqual(place.id, undefined);
        });
    });

    it('should remplace an existing place because id is set', () => {
        const data = init();
        const place = {
            id: '2',
            name: 'Lens2',
            author: 'Louis2',
            review: 3,
            image: null
        };
        return data.saveAsync(place).then(function() {
            assert.ok(true);
        });
    });

    it('should delete a place then fail to delete it again', () => {
        const data = init();
        return data.deleteAsync('3').then(function(success) {
            assert.ok(success);
            return data.deleteAsync('3').then(function(success) {
                assert.ok(!success);
            });
        });
    });
});
