const express = require('express');
const bodyParser = require('body-parser');
const Places = require('./places/controller');
const Data = require('./places/data');
const Files = require('./files/controller');

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

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

new Files(app);
new Places(app, new Data());


// eslint-disable-next-line no-unused-vars
app.use(function (error, request, response, next) {
    console.error(error.stack);
    response.status(500).json({
        message: 'Something broke!'
    });
});

module.exports = app;