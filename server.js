let express = require('express');
let http = require('http');
let bodyParser = require('body-parser');

let app = express();

app.use(bodyParser.json());

app.use(function (req, res, next) {
    console.log('got request', req.method, req.path);
    if (req.header('Origin')) {
        res.header('Access-Control-Allow-Origin', req.header('Origin'));
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, ForcePreflight');
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    next();
});

let router = express.Router();

let prev;

router.post('/longpost', function(req, resp) {
    let now = new Date().getTime();
    if (prev) {
        let dt = now - prev;
        console.log('format called ' + dt + 'ms after previous');
    }
    prev = now;
    setTimeout(function() {
        resp.send(JSON.stringify({status: 'OK'}));
    }, 10000)
});

app.use('/', router);

let server = http.createServer(app);
let iKeepAlive = process.argv.indexOf('--keepAliveTimeout');
if (iKeepAlive != -1) {
    // workaround: set the keepAliveTimeout property
    server.keepAliveTimeout = parseInt(process.argv[iKeepAlive + 1]);
    console.log('set keepAliveTimeout to', server.keepAliveTimeout);
}
server.listen(9666);
