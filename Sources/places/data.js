var Promise = require('bluebird');
var _ = require('lodash');
const uuidV1 = require('uuid/v1');
const _data = require('./data.json');

function _loadAsync() {
    return Promise.resolve(_.cloneDeep(_data));
}

function _saveAsync(data) {
    Object.assign(_data, data);
    return Promise.resolve();
}

class Data {

    getPlacesAsync() {
        return _loadAsync().then((data)=> data.places);
    }

    getPlaceAsync(id) {
        return _loadAsync().then(function (data) {
            const places = data.places;
            let place = _.find(places, {
                'id': id
            });
            return place;
        });
    }

    savePlaceAsync(place) {
        return _loadAsync().then(function (data) {
            let id = uuidV1();
            place.id = id;
            let newPlace = Object.assign({}, place);
            data.places.push(newPlace);
            return _saveAsync(data);
        });
    }

    deletePlaceAsync(id) {
        return _loadAsync().then(function (data) {
            let places = data.places;
            let place = _.find(places, {
                'id': id
            });
            if (place !== undefined) {
                var index = places.indexOf(place);
                places.splice(index, 1);
            }
            return _saveAsync({
                places
            });
        });
    }
}


module.exports = Data;