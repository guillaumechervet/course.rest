var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _data = require('./data.json');
const uuidV1 = require('uuid/v1');

// parse various different custom JSON types as JSON 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var accept = function (request, response, next) {
    response.headers['accept'] = 'application/json';
    next();
};
app.use(accept);

app.get('/places', function (request, response) {
    console.log('get /places called');
    response.json(_data);
});

app.post('/places', function (request, response) {
    console.log('post /places called');
    let newPlace = Object.assign({}, request.body);
    newPlace.id = uuidV1(); 
    _data.places.push(newPlace);
    response.json(newPlace);
});

app.get('/places/:id', function (request, response) {
    var id = request.params.id;
    var places = _data.places;
    for(var i=0; i< places.length; i++){
        var place = places[i];
        if(place.id === id){
            response.json(place);
            break;
        }
    }
    response.status(404).json({message:'Nothing found!'});
});

app.delete('/places/:id', function (request, response) {
    var id = request.params.id;
    var places = _data.places;
    for(var i=0; i<places.length; i++){
        var user = places[i];
        if(user.id === id){
            var index = places.indexOf(5);
            places.splice(index, 1);
            response.json({});
            break;
        }
    }
    response.status(404).json({message:'Nothing found!'});
});

// eslint-disable-next-line no-unused-vars
app.use(function(error, req, response, next) {
    console.error(error.stack);
    response.status(500).json({message:'Something broke!'});
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log(`Example app listening at http://${host}:${port}`);
});