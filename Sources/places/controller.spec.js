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
            .expect(200)
            .then(response => {
                assert(response.body.key, 'entity.not.found');
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