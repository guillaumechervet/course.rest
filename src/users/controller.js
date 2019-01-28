var jwt = require('jsonwebtoken');
var validation = require('mw.validation');
var serverUtil = require('../serverUtil');

const mapLinks = request => user => {
  const baseUrl = serverUtil.getBaseUrl(request);
  return {
    ...user,
    commments: {
      link: `${baseUrl}/api/comments?author.id=${user.id}`
    },
    places: {
      link: `${baseUrl}/api/places?author.id=${user.id}`
    }
  };
};

class Users {
  constructor(app, data) {
    // app.use(jwt({ secret: 'secret' }).unless({ path: ['/api/users/login'] }));

    app.options('/api/users/*', function(request, response) {
      response.header('Access-Control-Allow-Origin', 'http://localhost:3000');
      response.header('Access-Control-Allow-Methods', 'POST');
      response.header('Access-Control-Allow-Headers', 'Content-Type');
      response.json();
    });

    app.get('/api/users', function(request, response) {
      response.header('Access-Control-Allow-Origin', 'http://localhost:3000');
      response.header('Access-Control-Allow-Methods', 'GET,POST');
      response.header('Access-Control-Allow-Headers', 'Content-Type');

      data.getAllAsync().then(function(users) {
        response.setHeader('Cache-Control', 'public, max-age=30');
        response.json({
          users: users.map(mapLinks(request))
        });
      });
    });

    app.get('/api/user/:id', function(request, response) {
      let id = request.params.id;
      return data.getAsync(id).then(function(user) {
        if (user) {
          response.status(200).json(mapLinks(request)(user));
          return;
        }
        response.status(404).json({
          key: 'entity.not.found'
        });
      });
    });

    app.post('/api/users/login', function(request, response) {
      response.header('Access-Control-Allow-Origin', 'http://localhost:3000');
      response.header('Access-Control-Allow-Methods', 'POST');
      response.header('Access-Control-Allow-Headers', 'Content-Type');

      let login = request.body;

      const rules = {
        password: ['required', { equal: 'password' }],
        username: ['required', { equal: 'username' }]
      };
      var validationResult = validation.objectValidation.validateModel(
        login,
        rules,
        true
      );

      if (!validationResult.success) {
        response.status(400).json(validationResult.detail);
        return;
      }
      var token = jwt.sign({ username: 'username' }, 'secret');

      response.status(200).json({ jwt: token });
    });
  }
}
module.exports = Users;
