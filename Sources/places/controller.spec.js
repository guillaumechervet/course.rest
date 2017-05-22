const request = require('supertest');
const assert = require('assert');

describe('Places/controller', () => {

    it('GET /api/places/2 should respond a http 200 OK', () => {

        const app = require('../app');
        request(app)
            .get('/api/places/2')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                assert(response.body.author, 'Louis');
            });
    });

    it('GET /api/places/youhou should respond a http 404', () => {

        const app = require('../app');
        request(app)
            .get('/api/places/youhou')
            .expect('Content-Type', /json/)
            .expect(404)
            .then(response => {
                assert(response.body.key, 'entity.not.found');
            });
    });

    it('POST /api/places should respond a http 204 OK with no image', () => {

        var newPlace = {
            name: 'Londre',
            author: 'Patrick',
            review: 2,
            image: null
        };
        const app = require('../app');
        request(app)
            .post('/api/places')
            .send(newPlace)
            .expect('Location', /places/)
            .expect(204)
            .end(function (err, res) {
                if (err) throw err;
            });
    });

    it('POST /api/places should respond a http 204 OK with an image', () => {

        var newPlace = {
            name: 'Londre',
            author: 'Patrick',
            review: 2,
            image: {
                url: 'https://www.bworld.fr/api/file/get/c27e39ee-7ba9-46f8-aa7c-9e334c72a96c/d9d0634b-b1a0-42bd-843d-d3bc3cf7d842/ImageThumb/bworld-2016-v3.png',
                title: 'bworld place'
            }
        };
        const app = require('../app');
        request(app)
            .post('/api/places')
            .send(newPlace)
            .expect('Location', /places/)
            .expect(204)
            .end(function (err, res) {
                if (err) throw err;
            });

    });

    it('POST /api/places should respond a http 400 KO', () => {

        var newPlace = {
            name: '',
            author: 'Pat',
            review: 2,
            image: null
        };
        const app = require('../app');
        request(app)
            .post('/api/places')
            .send(newPlace)
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) throw err;
            });

    });

    it('POST /api/places should respond a http 400 KO', () => {

        const app = require('../app');
        var newPlace = {
            name: 'Londre &',
            author: 'Patrickmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm',
            review: 2,
            image: {
                  url: 'https://www.bworld.fr/api/file/get/c27e39ee-7ba9-46f8-aa7c-9e334c72a96c/d9d0634b-b1a0-42bd-843d-d3bc3cf7d842/ImageThumb/bworld-2016-v3.png',
                  title: ''
              }
        };
        request(app)
            .post('/api/places')
            .send(newPlace)
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) throw err;
            });

    });
 
    /*it('GET /api/places should respond a http 200 OK', () => {

        const app = require('../app');
        request(app)
            .get('/api/places')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
            });

    });

    it('DELETE /api/places/3 should respond a http 200 OK', () => {

        const app = require('../app');
        request(app)
            .delete('/api/places')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
            });

        request(app)
            .delete('/api/places')
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
                if (err) throw err;
            });

    });*/
});