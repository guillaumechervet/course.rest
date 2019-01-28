var validation = require('mw.validation');
var serverUtil = require('../serverUtil');

const mapLinks = request => comment => {
  const baseUrl = serverUtil.getBaseUrl(request);
  return {
    ...comment,
    reference: {
      ...comment.reference,
      link: `${baseUrl}/api/places/${comment.reference.id}`
    },
    author: {
      ...comment.author,
      link: `${baseUrl}/api/user/${comment.author.id}`
    }
  };
};

const filterQuery = query => comment => {
  const authorId = query['author.id'];
  if (authorId && comment.author.id !== authorId) {
    return false;
  }

  const referenceId = query['reference.id'];
  if (referenceId && comment.reference.id !== referenceId) {
    return false;
  }

  const type = query['reference.type'];
  if (type && comment.reference.type !== type) {
    return false;
  }

  return true;
};

class Comments {
  constructor(app, data) {
    app.options('/api/comments', function(request, response) {
      response.header('Access-Control-Allow-Origin', 'http://localhost:3000');
      response.header('Access-Control-Allow-Methods', 'GET,POST');
      response.header('Access-Control-Allow-Headers', 'Content-Type');
      response.json();
    });

    app.get('/api/comments', function(request, response) {
      response.header('Access-Control-Allow-Origin', 'http://localhost:3000');
      response.header('Access-Control-Allow-Methods', 'GET,POST');
      response.header('Access-Control-Allow-Headers', 'Content-Type');

      data.getAllAsync().then(function(comments) {
        response.setHeader('Cache-Control', 'public, max-age=30');
        response.json({
          comments: comments
            .map(mapLinks(request))
            .filter(filterQuery(request.query))
        });
      });
    });

    app.get('/api/comments/:id', function(request, response) {
      let id = request.params.id;
      return data.getAsync(id).then(function(comment) {
        if (comment !== undefined) {
          response.status(200).json(mapLinks(request)(comment));
          return;
        }
        response.status(404).json({
          key: 'entity.not.found'
        });
      });
    });

    app.post('/api/comments', function(request, response) {
      response.header('Access-Control-Allow-Origin', 'http://localhost:3000');
      response.header('Access-Control-Allow-Methods', 'GET,POST');
      response.header('Access-Control-Allow-Headers', 'Content-Type');

      let newComment = request.body;
      const rules = {
        id: ['required'],
        comment: [
          'required',
          {
            maxLength: {
              maxLength: 800
            }
          }
        ],
        '@reference': {
          id: ['required'],
          type: ['required']
        },
        '@author': { id: ['required'] }
      };
      var validationResult = validation.objectValidation.validateModel(
        newComment,
        rules,
        true
      );

      if (!validationResult.success) {
        response.status(400).json(validationResult.detail);
        return;
      }

      return data.saveAsync(newComment).then(function() {
        response.setHeader('Location', `/api/comments/${newComment.id}`);
        response.status(201).json();
      });
    });
  }
}
module.exports = Comments;
