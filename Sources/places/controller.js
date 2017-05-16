const _data = require('./data.json');
const uuidV1 = require('uuid/v1');
const _ = require('lodash');
const fileUpload = require('express-fileupload');
const path = require('path');

class Places {
    constructor(app, data) {

        app.use(fileUpload());

        app.post('/api/files', (request, response) => {
            if (!request.files) {
                return request.status(400).send('No files were uploaded.');
            }
            let file = request.files.image;
            let id = uuidV1();
            var filename = id + '_' + file.name;
            let filePath = path.join(__dirname, '/uploads', filename);
            file.mv(filePath, function (err) {
                if (err) {
                    return response.status(500).send(err);
                }
                response.setHeader('Location', `/api/files/${filename}`);
                response.json({
                    id: id,
                    filename: filename
                });
            });
        });

        app.get('/api/files/:filename', function (request, response) {
            let filename = request.params.filename;
            response.sendFile(path.join(__dirname, '/uploads', filename));
        });

        app.get('/api/places', function (request, response) {
            console.log('get /api/places called');
            data.getPlacesAsync().then(function (places) {
                response.json({
                    places: places
                });
            });
        });

        app.get('/api/places/:id', function (request, response) {
            let id = request.params.id;
            console.log(`get /api/places/:id called with id ${id}`);
            return data.getPlaceAsync(id).then(function (place) {
                if (place !== undefined) {
                    response.status(200).json(place);
                    return;
                }
                response.status(404).json({
                    message: 'Nothing found!'
                });
            });
        });

        app.delete('/api/places/:id', function (request, response) {
            var id = request.params.id;
            console.log(`delete /api/places/:id called with id ${id}`);
            data.deletePlaceAsync(id).then(function () {
                response.status(404).json({
                    message: 'Nothing found!'
                });
            });
        });

        app.post('/api/places', function (request, response) {
            console.log('post /api/places called');
            let newPlace = request.body;
            return data.savePlaceAsync(newPlace).then(function () {
                response.setHeader('Location', `/api/places/${id}`);
                response.status(204).json(newPlace);
            });
        });

        app.put('/api/places/:id', function (request, response) {
            let id = request.params.id;
            console.log(`put /api/places/:id called with id ${id}`);

            let places = _data.places;
            let place = _.find(places, {
                'id': id
            });
            if (place === undefined) {
                response.status(404).json({
                    message: 'Place not found'
                });
                return;
            }
            _.remove(places, {
                id: id
            });
            places.push(request.body);
            response.status(204).json();
        });

        app.patch('/api/places/:id', function (request, response) {
            let id = request.params.id;
            console.log(`patch /api/places/:id called with id ${id}`);

            let places = _data.places;
            let place = _.find(places, {
                'id': id
            });

            if (place === undefined) {
                response.status(404).json({
                    message: 'Place not found'
                });
                return;
            }
            Object.assign(place, request.body);
            response.status(204).json();
        });

    }


}
module.exports = Places;