var url = require('url');

function getBaseUrl(req) {
    return url.format({
        protocol: req.protocol,
        host: req.get('host')
    });
}

module.exports = {
    getBaseUrl
};
