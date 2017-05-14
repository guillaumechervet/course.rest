const express = require('express');
const bodyParser = require('body-parser');
const _data = require('./data.json');
const uuidV1 = require('uuid/v1');
const _ = require('lodash');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();

var middlewareHttp = function (request, response, next) {
    response.setHeader('Accept', 'application/json');

    console.log(request.method + ' ' + request.originalUrl);
    next();
   /* let contentType = request.headers['content-type'];
    if (contentType && contentType.indexOf('application/json') > -1) {
        next();
        return;
    }

    response.status(415).json({
        message: 'Content-Type incorrect'
    });*/
};
app.use(middlewareHttp);

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

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/api/places', function (request, response) {
    console.log('get /api/places called');
    response.json(_data);
});

app.get('/api/places/:id', function (request, response) {
    let id = request.params.id;
    console.log(`get /api/places/:id called with id ${id}`);
    let places = _data.places;
    let place = _.find(places, {
        'id': id
    });
    if (place !== undefined) {
        response.status(200).json(place);
        return;
    }
    response.status(404).json({
        message: 'Nothing found!'
    });
});

app.delete('/api/places/:id', function (request, response) {
    var id = request.params.id;
    console.log(`delete /api/places/:id called with id ${id}`);
    var places = _data.places;
    let place = _.find(places, {
        'id': id
    });
    if (place !== undefined) {
        var index = places.indexOf(place);
        places.splice(index, 1);
        response.status(204).json();
        return;
    }
    response.status(404).json({
        message: 'Nothing found!'
    });
});



app.post('/api/places', function (request, response) {
    console.log('post /api/places called');
    let newPlace = Object.assign({}, request.body);
    let id = uuidV1();
    newPlace.id = id;
    _data.places.push(newPlace);
    response.setHeader('Location', `/api/places/${id}`);
    response.status(204).json(newPlace);
});

app.put('/api/places/:id', function (request, response) {
    let id = request.params.id;
    console.log(`put /api/places/:id called with id ${id}`);

    let places = _data.places;
    let place = _.find(places, {
        'id': id
    });
    if (place === undefined) {
        response.status(422).json({
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
        response.status(422).json({
            message: 'Place not found'
        });
        return;
    }
    Object.assign(place, request.body);
    response.status(204).json();
});

// eslint-disable-next-line no-unused-vars
app.use(function (error, request, response, next) {
    console.error(error.stack);
    response.status(500).json({
        message: 'Something broke!'
    });
});


module.exports = app;