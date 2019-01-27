const App = require('./app');

const app = new App().app;

var port = process.env.PORT || 8080;
var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log(`Example app listening at http://${host}:${port}`);
});
