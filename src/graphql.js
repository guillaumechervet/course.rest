var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
var validation = require('mw.validation');

//https://medium.com/codingthesmartway-com-blog/creating-a-graphql-server-with-node-js-and-express-f6dddc5320e1
var coursesData = [
  {
    id: 1,
    title: 'The Complete Node.js Developer Course',
    author: 'Andrew Mead, Rob Percival',
    description:
      'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
    topic: 'Node.js',
    url: 'https://codingthesmartway.com/courses/nodejs/'
  },
  {
    id: 2,
    title: 'Node.js, Express & MongoDB Dev to Deployment',
    author: 'Brad Traversy',
    description:
      'Learn by example building & deploying real-world Node.js applications from absolute scratch',
    topic: 'Node.js',
    url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
  },
  {
    id: 3,
    title: 'JavaScript: Understanding The Weird Parts',
    author: 'Anthony Alicea',
    description:
      'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
    topic: 'JavaScript',
    url: 'https://codingthesmartway.com/courses/understand-javascript/'
  }
];
var getCourse = function(args) {
  var id = args.id;
  return coursesData.filter(course => {
    return course.id == id;
  })[0];
};
var getCourses = function(args) {
  if (args.topic) {
    var topic = args.topic;
    return coursesData.filter(course => course.topic === topic);
  } else {
    return coursesData;
  }
};

var updateCourseTopic = function({ id, topic }) {
  coursesData.map(course => {
    if (course.id === id) {
      course.topic = topic;
      return course;
    }
  });
  return coursesData.filter(course => course.id === id)[0];
};

class GraphQL {
  constructor(app, data) {
    var getPlaces = async args => {
      const places = await data.getAllAsync();
      if (args.name) {
        var name = args.name;
        return places.filter(place => place.name === name);
      } else {
        return places;
      }
    };

    var insertPlace = async args => {
      const newPlace = args.placeInput;
      const onlyIf = function() {
        if (newPlace.image && newPlace.image.url) {
          return true;
        }
        return false;
      };
      const rules = {
        id: ['required'],
        name: [
          'required',
          {
            minLength: {
              minLength: 3
            }
          },
          {
            maxLength: {
              maxLength: 100
            }
          },
          {
            pattern: {
              regex: /^[a-zA-Z -]*$/
            }
          }
        ],
        author: ['required'],
        review: ['required', 'digit'],
        '@image': {
          url: ['url'],
          title: [
            {
              required: {
                onlyIf: onlyIf,
                message: 'Field Image title is required'
              }
            }
          ]
        }
      };
      var validationResult = validation.objectValidation.validateModel(
        newPlace,
        rules,
        true
      );

      if (!validationResult.success) {
        throw new Error(JSON.stringify(validationResult));
      }

      return data.saveAsync(args);
    };

    const deletePlace = args => {
      data.deleteAsync(args.id).then(function(success) {
        if (!success) {
          //TODO
        }
      });
    };

    // GraphQL schema
    var schema = buildSchema(`
type Query {
    message: String
    course(id: Int!): Course
    courses(topic: String): [Course]
    places(name: String): [Place]
},
type Mutation {
    updateCourseTopic(id: Int!, topic: String!): Course
    insertPlace(placeInput:PlaceInput!) : String
    deletePlace(id: String!) : String
}
type Course {
    id: Int
    title: String
    author: String
    description: String
    topic: String
    url: String
}
type Place {
    id: ID
    name: String
    review: Int
    image: File
}

input PlaceInput {
    name: String
    review: Int
    image: FileInput
}

type File {
  url: String
  title: String
}

input FileInput {
  url: String
  title: String
}

`);
    // Root resolver
    var root = {
      message: () => 'Hello World!',
      course: getCourse,
      places: getPlaces,
      insertPlace: insertPlace,
      updateCourseTopic,
      deletePlace,
      courses: getCourses
    };

    app.use(
      '/graphql',
      express_graphql({
        schema: schema,
        rootValue: root,
        graphiql: true
      })
    );
  }
}
module.exports = GraphQL;
