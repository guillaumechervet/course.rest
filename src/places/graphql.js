const express_graphql = require('express-graphql');
const validation = require('mw.validation');

class GraphQLPlaces {
  constructor(data) {
    const getPlaces = async args => {
      const places = await data.getAllAsync();
      if (args.name) {
        var name = args.name;
        return places.filter(place => place.name === name);
      } else {
        return places;
      }
    };

    const insertPlace = async args => {
      const newPlace = args.placeInput;
      const onlyIf = function() {
        if (newPlace.image && newPlace.image.url) {
          return true;
        }
        return false;
      };
      const rules = {
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
          throw new Error('id not found in database');
        }
      });
    };

    // GraphQL schema
    this.schema = `

type Place {
    id: ID
    name: String
    review: Int
    image: File
}

type File {
  url: String
  title: String
}

type Query {
  places(name: String): [Place]
}

input InsertPlaceInput {
  name: String
  title: String
  review: Int
  image: FileInput
}

input UpdatePlaceInput {
  id: ID
  name: String
  title: String
  review: Int
  image: FileInput
}

type Mutation {
  insertPlace(placeInput:InsertPlaceInput!) : String
  deletePlace(id: String!) : String
}

input FileInput {
  url: String
  title: String
}

`;
    // Root resolver
    this.root = {
      places: getPlaces,
      insertPlace: insertPlace,
      deletePlace
    };
  }
}
module.exports = GraphQLPlaces;
