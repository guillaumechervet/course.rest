var validation = require('mw.validation');

class Places {
    constructor(app, data) {

        app.get('/api/places', function (request, response) {
            data.getPlacesAsync().then(function (places) {
                response.setHeader('Cache-Control', 'private, max-age=30');
                response.json({
                    places: places
                });
            });
        });

        app.get('/api/places/:id', function (request, response) {
            let id = request.params.id;
            return data.getPlaceAsync(id).then(function (place) {
                if (place !== undefined) {
                    response.status(200).json(place);
                    return;
                }
                response.status(404).json({
                    key: 'entity.not.found'
                });
            });
        });

        app.delete('/api/places/:id', function (request, response) {
            var id = request.params.id;
            data.deletePlaceAsync(id).then(function (success) {
                if (success) {
                    response.status(204).json();
                } else {
                    response.status(404).json({
                        message: 'entity.not.found'
                    });
                }
            });
        });

        app.post('/api/places', function (request, response) {
            let newPlace = request.body;

            var onlyIf = function () {
                if (newPlace.image && newPlace.image.url) {
                    return true;
                }
                return false;
            };
            const rules = {
                id: ['required'],
                name: ['required', {
                    minLength: {
                        minLength: 3
                    }
                }, {
                    maxLength: {
                        maxLength: 100
                    }
                }, {
                    pattern: {
                        regex: /^[a-zA-Z -]*$/
                    }
                }],
                author: ['required'],
                review: ['required', 'digit'],
                '@image': {
                    url: ['url'],
                    title: [{
                        required: {
                            onlyIf: onlyIf,
                            message: 'Field Image title is required'
                        }
                    }]
                }
            };
            var validationResult = validation.objectValidation.validateModel(newPlace, rules, true);

            if (!validationResult.success) {
                response.status(400).json(validationResult.detail);
                return;
            }

            return data.savePlaceAsync(newPlace).then(function () {
                response.setHeader('Location', `/api/places/${newPlace.id}`);
                response.status(204).json(newPlace);
            });
        });

        app.put('/api/places/:id', function (request, response) {
            let id = request.params.id;
            console.log(`put /api/places/:id called with id ${id}`);
            const newPlace = request.body;
            const onlyIf = function () {
                if (newPlace.image && newPlace.image.url) {
                    return true;
                }
                return false;
            };
            const rules = {
                id: ['required'],
                name: ['required', {
                    minLength: {
                        minLength: 3
                    }
                }, {
                    maxLength: {
                        maxLength: 100
                    }
                }, {
                    pattern: {
                        regex: /^[a-zA-Z -]*$/
                    }
                }],
                author: ['required'],
                review: ['required', 'digit'],
                '@image': {
                    url: ['url'],
                    title: [{
                        required: {
                            onlyIf: onlyIf,
                            message: 'Field Image title is required'
                        }
                    }]
                }
            };
            var validationResult = validation.objectValidation.validateModel(newPlace, rules, true);

            if (!validationResult.success) {
                response.status(400).json(validationResult.detail);
                return;
            }

            return data.getPlaceAsync(id).then(function (place) {
                if (place === undefined) {
                    response.status(404).json({
                        message: 'entity.not.found'
                    });
                    return;
                }
                data.savePlaceAsync(newPlace).then(function () {
                    response.status(204).json();
                });
            });

        });

        app.patch('/api/places/:id', function (request, response) {
            let id = request.params.id;
            console.log(`patch /api/places/:id called with id ${id}`);
            const newData = request.body;
            const onlyIf = function () {
                if (newData.image && newData.image.url) {
                    return true;
                }
                return false;
            };
            const rules = {
                id: [],
                name: [{
                    minLength: {
                        minLength: 3
                    }
                }, {
                    maxLength: {
                        maxLength: 100
                    }
                }, {
                    pattern: {
                        regex: /^[a-zA-Z -]*$/
                    }
                }],
                author: ['url'],
                review: ['digit'],
                '@image': {
                    url: [],
                    title: [{
                        required: {
                            onlyIf: onlyIf,
                            message: 'Field Image title is required'
                        }
                    }]
                }
            };
            var validationResult = validation.objectValidation.validateModel(newData, rules, true);

            if (!validationResult.success) {
                response.status(400).json(validationResult.detail);
                return;
            }

            return data.getPlaceAsync(id).then(function (place) {
                if (place === undefined) {
                    response.status(404).json({
                        message: 'entity.not.found'
                    });
                    return;
                }
                Object.assign(place, newData);
                return data.savePlaceAsync(place).then(function () {
                    response.status(204).json();
                });
            });
        });
    }
}
module.exports = Places;