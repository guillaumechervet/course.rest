const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const app = express();
const uuidV1 = require('uuid/v1');
 
// default options 
app.use(fileUpload());

app.post('/api/files', (request, response) => {
    if (!request.files)
        return request.status(400).send('No files were uploaded.');
 
    let file = request.files.image;
    let id = uuidV1();
    var filename = id + '_' + file.name;
    let filePath = path.join(__dirname, '/uploads', filename );
    file.mv(filePath, function(err) {
        if (err)
            return response.status(500).send(err);
        
       
        response.setHeader('Location', `/api/files/${filename}`);
        response.json({id: id, filename: filename});
    });
});

// eslint-disable-next-line no-unused-vars
app.use(function(error, req, response, next) {
    console.error(error.stack);
    response.status(500).json({message:'Something broke!'});
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log(`Example app listening at http://${host}:${port}`);
});