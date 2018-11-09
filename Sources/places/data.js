const Promise = require('bluebird');
const _ = require('lodash');
const uuidV1 = require('uuid/v1');
const jsonData = require('./data.json');

const cloneJsonData = _.cloneDeep(jsonData);

function waitAsync(data) {
    const deferred = Promise.defer();

    const msToWait = Math.floor(Math.random() * 400 + 1);
    setTimeout(function() {
        deferred.resolve(data);
    }, msToWait);

    return deferred.promise;
}

function _loadAsync(_data) {
    return waitAsync(_.cloneDeep(_data));
}

function _saveAsync(data, _data) {
    Object.assign(_data, data);
    return waitAsync();
}

class Data {
    constructor() {
        this._data = cloneJsonData;
    }

    getPlacesAsync() {
        return _loadAsync(this._data).then(data => _.cloneDeep(data.places));
    }

    getPlaceAsync(id) {
        return _loadAsync(this._data).then(function(data) {
            const places = data.places;
            let place = _.find(places, {
                id: id
            });
            return _.cloneDeep(place);
        });
    }

    savePlaceAsync(place) {
        var _self = this;
        return _loadAsync(this._data).then(function(data) {
            const places = data.places;
            let id;
            if (!place.id) {
                // insert
                id = uuidV1();
                let newPlace = _.cloneDeep(place);
                newPlace.id = id;
                places.push(newPlace);
            } else {
                // replace
                id = place.id;
                _.remove(places, {
                    id
                });
                places.push(_.cloneDeep(place));
            }
            return _saveAsync(data, _self._data).then(() => id);
        });
    }

    deletePlaceAsync(id) {
        var _self = this;
        return _loadAsync(this._data).then(function(data) {
            let places = data.places;
            let place = _.find(places, {
                id: id
            });
            if (place !== undefined) {
                var index = places.indexOf(place);
                places.splice(index, 1);
            } else {
                return false;
            }
            return _saveAsync(
                {
                    places
                },
                _self._data
            ).then(() => true);
        });
    }
}

module.exports = Data;