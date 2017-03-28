const request = require('supertest');

describe('Index Version', () => {

    it('should respond a http 200 OK', () => {

        const app = require('./app');

        return request(app)
            .get('/customers/version')
            .expect(200);
    });
});

describe('isalive Mon AXA App', () => {

    it('should respond a http 200 OK', () => {

        const app = require('./app');

        return request(app)
            .get('/customers/isalive.json')
            .expect(200);
    });
});