let request = require('request');
let http = require('http');

let agent = new http.Agent({
    keepAlive: true,
});

let baseUrl = 'http://localhost:9666';

function getStatus() {
    request.get(baseUrl + '/status', {
        agent: agent
    }, function (err, resp) {
        if (err) {
            throw err;
        }
        console.log('got get response', resp.statusCode, resp.body);
    });
}

request(baseUrl + '/longpost', {
    method: 'OPTIONS',
    agent: agent
}, function(err, resp) {
    if (err) {
        throw err;
    }
    console.log('got options response', resp.statusCode);
    console.log('sending post request')
    request.post(baseUrl + '/longpost', {
            agent: agent,
            json: true,
            body: {id: 1},
            headers: [
                { name: 'Connection', value: 'keep-alive' }
            ]
        }, function(err, resp) {
        if (err) {
            throw err;
        }
        console.log('got post response', resp.statusCode, resp.body);
    });
});
