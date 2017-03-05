var express = require('express');
var app = express();
var js2xmlparser = require('js2xmlparser');

var _data = require('./data.json');

// parse various different custom JSON types as JSON 
//app.use(express.json());
//app.use(express.urlencoded());

app.get('/places', function (request, response, next) {
    console.log('get /users called'); 

     var contentType = request.headers['content-type'];
     if (contentType) {
        if(contentType.indexOf('application/json') > -1) {
            response.end(JSON.stringify(_data));
        } else {
            response.end(js2xmlparser.parse("root", _data));
        }
     }else{
        next();
     }
    
});

/*
app.post('/places', function (request, response) {
    _data.places.push(request.body);
    response.end( JSON.stringify(request.body));
});

app.get('/places/:id', function (request, response) {
   var id = request.params.id;
    for(var i=0; i<users.length; i++){
        var user = users[i];
        if(user.id === id){
            response.end(JSON.stringify(user));
            break;
        }
   }
})

app.delete('/places/:id', function (request, response) {
    var id = request.params.id;
    for(var i=0; i<users.length; i++){
        var user = users[i];
        if(user.id === id){
            var index = users.indexOf(5);
            users.splice(index, 1);
            response.end(JSON.stringify({}));
            break;
        }
   }
})*/

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});