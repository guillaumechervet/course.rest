var Promise = require('bluebird');
var _ = require('lodash');
const uuidV1 = require('uuid/v1');
const _data = require('./data.json');

function waitAsync(data) {
    const deferred = Promise.defer();

    const msToWait = Math.floor((Math.random() * 400) + 1);
    setTimeout(function () {
        deferred.resolve(data);
    }, msToWait);

    return deferred.promise;
}

function _loadAsync() {
    return waitAsync(_.cloneDeep(_data));
}

function _saveAsync(data) {
    Object.assign(_data, data);
    return waitAsync(); // Promise.resolve()
}

class Data {

    getPlacesAsync() {
        return _loadAsync().then((data) => data.places);
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
            const places = data.places;
            if (!place.id) {
                // insert
                let id = uuidV1();
                place.id = id;
                let newPlace = Object.assign({}, place);
                places.push(newPlace);
            } else {
                // replace
                _.remove(places, {
                    id: place.id
                });
                places.push(places);
            }
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
            } else {
                return false;
            }
            return _saveAsync({
                places
            }).then(() => true);
        });
    }
}


module.exports = Data;