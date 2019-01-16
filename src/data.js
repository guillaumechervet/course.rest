var _ = require('lodash');
const uuidV1 = require('uuid/v1');

class Data {
  constructor(jsonData) {
    function waitAsync(data) {
      const promise = new Promise(function(resolve, reject) {
        const msToWait = Math.floor(Math.random() * 400 + 1);
        setTimeout(function() {
          resolve(data);
        }, msToWait);
      });
      return promise;
    }

    this._loadAsync = async data => {
      return await waitAsync(_.cloneDeep(data));
    };

    this._saveAsync = async (data, _data) => {
      Object.assign(_data, data);
      return waitAsync();
    };

    this._data = _.cloneDeep(jsonData);
  }

  getAllAsync() {
    return this._loadAsync(this._data).then(data => data.data);
  }

  getAsync(id) {
    return this._loadAsync(this._data).then(function(data) {
      const places = data.data;
      let place = _.find(places, {
        id: id
      });
      return place;
    });
  }

  saveAsync(place) {
    var _self = this;
    return this._loadAsync(this._data).then(function(data) {
      let id = null;
      const places = data.data;
      if (!place.id) {
        // insert
        id = uuidV1();
        let newPlace = Object.assign({}, place);
        newPlace.id = id;
        places.push(newPlace);
      } else {
        // replace
        id = place.id;
        _.remove(places, {
          id: place.id
        });
        places.push(place);
      }
      return _self._saveAsync(data, _self._data).then(() => id);
    });
  }

  deleteAsync(id) {
    var _self = this;
    return this._loadAsync(this._data).then(function(data) {
      let places = data.data;
      let place = _.find(places, {
        id: id
      });
      if (place !== undefined) {
        var index = places.indexOf(place);
        places.splice(index, 1);
      } else {
        return false;
      }
      return _self
        ._saveAsync(
          {
            places
          },
          _self._data
        )
        .then(() => true);
    });
  }
}

module.exports = Data;
