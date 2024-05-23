import ws  from 'nodejs-websocket';
import http from 'http';
import url from 'url';

const port = 3715;
let x = 0;
let y = 0;
let data = {};
const status = [ { "status" : 0, "crc32":"9ec4ace4", "size": 84520, "timestamp": "24/09/2023, 18:01:04" } ,
{ "status" : 1, "crc32":"0", "size": "0", "timestamp": '01/01/1970, 01:00:00' }
] 
const modbus = {
    "enable": true,
    "interval": 500,
    "overRange" : {
        "enable": true,
        "coil": 1,
    },
    "underRange" : {
        "enable": true,
        "coil": 2,
    },
    "onRange" : {
        "enable": true,
        "coil": 3,
    }
}
function generate(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const serverREST = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    const setCorsHeaders = (response) => {
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    };

    if (req.method === 'OPTIONS') {
        setCorsHeaders(res);
        res.writeHead(200);
        res.end();
        return;
    }

    setCorsHeaders(res);

    if (req.method === 'GET' && parsedUrl.pathname === '/api/network/settings') {
        data = {"ip":"192.168.0.4", "mask":"255.255.255.255", "gw":"192.168.0.1", "mac":"FF:FF:FF:FF:FF:FF"};
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    } else if(req.method === 'GET' && parsedUrl.pathname === '/api/temperature/settings') {
        data = {"low": -20.256, "high": 125.235};
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    } else if(req.method === 'GET' && parsedUrl.pathname === '/api/firmware/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(status));
    }
    else if(req.method === 'GET' && parsedUrl.pathname === '/api/modbus/settings') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(modbus));
    }
    else if(req.method === 'GET' && parsedUrl.pathname === '/api/firmware/commit') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({status: 'ok'}));
    }
    else if(req.method === 'GET' && parsedUrl.pathname === '/api/firmware/rollback') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({status: 'ok'}));
    }
    else if(req.method === 'GET' && parsedUrl.pathname === '/api/device/reset') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({status: 'ok'}));
    }
    else if(req.method === 'POST' && parsedUrl.pathname === '/api/modbus/settings'){
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('ok');
    }
    else if(req.method === 'POST' && parsedUrl.pathname === '/api/temperature/settings'){
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('ok');
    }
    else if(req.method === 'POST' && parsedUrl.pathname === '/api/firmware/upload'){
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({status: 'ok'}));
    }
    // new
    else if(req.method === 'GET' && parsedUrl.pathname === '/api/outputs') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            sliders: [50,2,3,4,5,56,17,8],
            checkboxs: [false, false, true, true, false, false, true, true],
            currentLimits: [500,2200,3000,2000,1000,560,1700,2800],
            switchs: [false, false, true, true, false, false, true, true],
        }));
    }
    else if(req.method === 'POST' && parsedUrl.pathname === '/api/outputs'){
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({status: 'ok'}));
    }
    else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Device API out of order');
    }
});

serverREST.listen(port, () => {
    console.log('Server running');
});

let serverWS = ws.createServer(function (conn) {
    console.log('connection established')
    conn.on('error', (err) => {
    });
    conn.on('close', () => {
    });
    conn.on("text", function (str) {
        try {
            console.log(JSON.parse(str));
        } catch (error) {
        }
    });

    setInterval(() => {
        x = generate(-50.012, 180.156);
        y = x + 13.031;
        data = {"tmcu": x,"vsupply": y,"tsens": x};
            try {
                conn.send(JSON.stringify(data));
            } catch (error) {
            }
    }, 200);
}).listen(80) + "/ws";