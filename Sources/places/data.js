var _ = require('lodash');
const uuidV1 = require('uuid/v1');
var jsonData = require('./data.json');
var cloneJsonData = _.cloneDeep(jsonData);

function waitAsync(data) {
  const promise = new Promise(function(resolve, reject) {
    const msToWait = Math.floor(Math.random() * 400 + 1);
    setTimeout(function() {
      resolve(data);
    }, msToWait);
  });
  return promise;
}

const _loadAsync = async data => {
  return await waitAsync(_.cloneDeep(data));
};

const _saveAsync = async (data, _data) => {
  Object.assign(_data, data);
  return waitAsync();
};

class Data {
  constructor() {
    this._data = cloneJsonData;
  }

  getPlacesAsync() {
    return _loadAsync(this._data).then(data => data.places);
  }

  getPlaceAsync(id) {
    return _loadAsync(this._data).then(function(data) {
      const places = data.places;
      let place = _.find(places, {
        id: id
      });
      return place;
    });
  }

  savePlaceAsync(place) {
    var _self = this;
    return _loadAsync(this._data).then(function(data) {
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
