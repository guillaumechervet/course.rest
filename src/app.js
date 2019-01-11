const express = require('express');
const bodyParser = require('body-parser');
const Places = require('./places/controller');
const Comments = require('./comments/controller');
const GraphqlPlaces = require('./places/graphql');
const Users = require('./users/controller');
const Data = require('./data');
const Files = require('./files/controller');
const packageJson = require('../package.json');
const chalk = require('chalk');
const log = console.log;
/*
const getReponseBody = response => {
    const oldWrite = response.write,
        oldEnd = response.end;
    const chunks = [];
    response.write = function(chunk) {
        chunks.push(chunk);
        oldWrite.apply(response, arguments);
    };
    let body = null;
    response.end = function(chunk) {
        if (chunk) chunks.push(chunk);
        body = Buffer.concat(chunks).toString('utf8');
        oldEnd.apply(response, arguments);
    };
    return () => body;
};*/

class App {
    constructor() {
        const app = express();

        app.use(
            bodyParser.urlencoded({
                extended: true
            })
        );
        app.use(bodyParser.json());

        var middlewareHttpRequest = function(request, response, next) {
            if (request.url.includes('favicon.ico')) {
                next();
                return;
            }

            response.setHeader('Accept', 'application/json');
            response.setHeader('Api-version', packageJson.version);
            log(
                chalk.white.bgBlack(
                    '----------------------------------------------------- '
                )
            );
            log(chalk.bold('request.url :') + chalk(new Date()));
            log(chalk.black.bgYellow.underline(`${request.method} ${request.url}`));
            log(chalk.bold('request.headers :'));
            log(chalk.green(`${JSON.stringify(request.headers, null, 2)}`));
            if (request.body && Object.keys(request.body).length > 0) {
                log(chalk.bold('request.body :'));
                log(chalk.green(`${JSON.stringify(request.body, null, 2)}`));
            }

            //const getBody = getReponseBody(response);
            response.on('finish', () => {
                log(chalk.bold('response.headers :'));
                log(chalk.blue(`${JSON.stringify(response.getHeaders(), null, 2)}`));
                /*const body = getBody();
                if (body && Object.keys(body).length > 0) {
                    log(chalk.bold('response.body :'));
                    log(chalk.blue(`${JSON.stringify(request.body, null, 2)}`));
                }*/
            });

            next();
        };
        app.use(middlewareHttpRequest);

        new Files(app);
        var placeData = new Data(require('./places/data.json'));
        new Places(app, placeData);
        new Users(app, new Data(require('./users/data.json')));
        new Comments(app, new Data(require('./comments/data.json')));
        new GraphqlPlaces(app, placeData);

        app.get('/api/version', function(request, response) {
            response.json({
                version: packageJson.version
            });
        });

        var middleware404 = function(request, response) {
            response.json({
                key: 'not.found'
            });
        };
        app.use(middleware404);

        // eslint-disable-next-line no-unused-vars
        app.use(function(error, request, response, next) {
            console.error(error.stack);
            response.status(500).json({
                key: 'server.error'
            });
        });

        this.app = app;
    }
}

module.exports = App;
