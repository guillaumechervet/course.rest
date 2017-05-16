var BPromise = require('bluebird');
var fsPromise = BPromise.promisifyAll(require('fs'));
var path = require('path');
var _ = require('lodash');
var filePath = path.resolve(__dirname, './data.json');

function _loadAsync(path) {
    return fsPromise.readFileAsync(path).then(function (content) {
        console.log(content);
        return JSON.parse(content);
    });
}

function _saveAsync(data, path) {
    return fsPromise.writeFileAsync(path, JSON.stringify(data, null, 4));
}

function getPlacesAsync() {
    return _loadAsync(filePath).then((data)=> data.places);
}

function deletePlaceAsync(id) {

    return _loadAsync(filePath).then(function (data) {
        let places = data.places;
        let place = _.find(places, {
            'id': id
        });
        if (place !== undefined) {
            var index = places.indexOf(place);
            places.splice(index, 1);
        }
        return _saveAsync({places}, filePath);
    });
}

exports.getPlacesAsync = getPlacesAsync;
exports.deletePlaceAsync = deletePlaceAsync;

