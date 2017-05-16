const request = require('supertest');

describe('Places/controller', () => {

    it('GET /api/places should respond a http 200 OK', () => {

        const app = require('../app');
        request(app)
            .get('/places')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
            });

    });

    it('DELETE /api/places/3 should respond a http 200 OK', () => {

        const app = require('../app');
        request(app)
            .delete('/places')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
            });

        request(app)
            .delete('/places')
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
                if (err) throw err;
            });

    });
});
