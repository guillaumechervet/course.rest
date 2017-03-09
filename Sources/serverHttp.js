var express = require('express');
var app = express();
var js2xmlparser = require('js2xmlparser');

var _data = require('./data.json');

app.get('/', function (request, response) {
    const responseText = 'Hello World!';
    response.headers['accept'] = 'text/html;q=0.9, */*';
    response.send(responseText);
});

var accept = function (request, response, next) {
     //https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept
    response.headers['accept'] = 'application/json, application/xml;q=0.9, */*;q=0.8';
    next();
};
app.use(accept);

app.get('/places', function (request, response, next) {
    console.log('get /places called');

    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
    var contentType = request.headers['content-type'];
    if (contentType) {
        if(contentType.indexOf('application/json') > -1) {
            response.end(JSON.stringify(_data));
        } else {
            response.end(js2xmlparser.parse('root', _data));
        }
    } else{
        next();
    }
    
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log(`Example app listening at http://${host}:${port}`);
});

