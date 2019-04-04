const uuidV1 = require('uuid/v1');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
var serverUtil = require('../serverUtil');

const mapLinks = request => file => {
    const baseUrl = serverUtil.getBaseUrl(request);
    const newFile = {
        link: `${baseUrl}/api/files/${encodeURIComponent(file)}`
    };

    return newFile;
};

class Files {
    constructor(app) {
        app.use(fileUpload());

        app.post('/api/files', (request, response) => {
            if (!request.files) {
                return request.status(400).send('No files were uploaded.');
            }
            let file = request.files.image;
            let id = uuidV1();
            var filename = id + '_' + file.name;
            let filePath = path.join(__dirname, '/uploads', filename);
            file.mv(filePath, function(err) {
                if (err) {
                    return response.status(500).send(err);
                }
                response.setHeader('Location', `/api/files/${filename}`);
                response.json({
                    id: id,
                    filename: filename
                });
            });
        });

        app.get('/api/files', function(request, response) {
            const dir = path.join(__dirname, '/uploads');
            fs.readdir(dir, (err, files) => {
                console.log(files);
                const newFiles = files.map(mapLinks(request));
                response.json({
                    files: newFiles
                });
            });
        });

        app.get('/api/files/:filename', function(request, response) {
            let filename = request.params.filename;
            response.sendFile(path.join(__dirname, '/uploads', filename));
        });
    }
}
module.exports = Files;
