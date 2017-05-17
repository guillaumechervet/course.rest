
class Places {
    constructor(app, data) {

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
            data.deletePlaceAsync(id).then(function (success) {
                if (success) {
                    response.status(204).json();
                } else {
                    response.status(404).json({
                        message: 'Place not found'
                    });
                }
            });
        });

        app.post('/api/places', function (request, response) {
            console.log('post /api/places called');
            let newPlace = request.body;
            return data.savePlaceAsync(newPlace).then(function () {
                response.setHeader('Location', `/api/places/${newPlace.id}`);
                response.status(204).json(newPlace);
            });
        });

        app.put('/api/places/:id', function (request, response) {
            let id = request.params.id;
            console.log(`put /api/places/:id called with id ${id}`);

            return data.getPlaceAsync(id).then(function (place) {
                if (place === undefined) {
                    response.status(404).json({
                        message: 'Place not found'
                    });
                    return;
                }
                data.savePlaceAsync(request.body).then(function () {
                    response.status(204).json();
                });
            });

        });

        app.patch('/api/places/:id', function (request, response) {
            let id = request.params.id;
            console.log(`patch /api/places/:id called with id ${id}`);

            return data.getPlaceAsync(id).then(function (place) {
                if (place === undefined) {
                    response.status(404).json({
                        message: 'Place not found'
                    });
                    return;
                }
                Object.assign(place, request.body);
                data.savePlaceAsync(place).then(function () {
                    response.status(204).json();
                });
            });
        });
    }
}
module.exports = Places;