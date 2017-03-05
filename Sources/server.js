var express = require('express');
var app = express();

var users = require('./users.json');

app.get('/users', function (request, response) {
    console.log('get /users called'); 
    response.end(JSON.stringify(users));
});

/*
app.post('/users', function (request, response) {
    users.push(request.body);
    res.end( JSON.stringify(data));
});

app.get('/users/:id', function (request, response) {
   var id = request.params.id;
    for(var i=0; i<users.length; i++){
        var user = users[i];
        if(user.id === id){
            response.end(JSON.stringify(user));
            break;
        }
   }
})

app.delete('/users/:id', function (request, response) {
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