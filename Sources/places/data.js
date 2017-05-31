var Promise = require('bluebird');
var _ = require('lodash');
const uuidV1 = require('uuid/v1');
var jsonData = require('./data.json');
var cloneJsonData = _.cloneDeep(jsonData);

function waitAsync(data) {
    const deferred = Promise.defer();

    const msToWait = Math.floor((Math.random() * 400) + 1);
    setTimeout(function () {
        deferred.resolve(data);
    }, msToWait);

    return deferred.promise; 
}

function _loadAsync(_data) {
    return waitAsync(_.cloneDeep(_data));
}

function _saveAsync(data, _data) {
    Object.assign(_data, data);
    return waitAsync(); // Promise.resolve()
}

class Data {
    constructor(){
        this._data = cloneJsonData;
    }

    getPlacesAsync() {
        return _loadAsync(this._data).then((data) => data.places);
    }

    getPlaceAsync(id) {
        return _loadAsync(this._data).then(function (data) {
            const places = data.places;
            let place = _.find(places, {
                'id': id
            });
            return place;
        });
    }

    savePlaceAsync(place) {
        var _self = this;
        return _loadAsync(this._data).then(function (data) {
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
                places.push(place);
            }
            return _saveAsync(data, _self._data);
        });
    }

    deletePlaceAsync(id) {
        var _self = this;
        return _loadAsync(this._data).then(function (data) {
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
            }, _self._data).then(() => true);
        });
    }
}


module.exports = Data;