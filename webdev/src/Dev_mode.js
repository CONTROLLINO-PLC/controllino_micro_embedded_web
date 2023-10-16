const spawn = require('child_process').spawn;
let dev = `let ws = require("nodejs-websocket");
let x = 0;
let y = 0;
let data = [];
function generate(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
let server = ws.createServer(function (conn) {
    console.log('connection established')
    conn.on('error', (err) => {
        console.log('connection error', err);
    });
    conn.on('close', () => {
        console.log('connection closed');
    });
    conn.on("text", function (str) {
        try {
            console.log(JSON.parse(str));
        } catch (error) {
            console.log('error parsing JSON:', error);
        }
    });

    setInterval(() => {
        x = generate(25, 80);
        y = x + 13;
        data = [{"serial": ""},{"tmcu": x,"vsply": y,"tsens": x},{"ip": "10.22.1.184",
                "gateway": "10.22.1.254","subnet": "255.255.255.0","mac": "02:20:eb:00:00:00"},
                {"do": [false, false, false, false, false, false, false, false],
                "di": [false, false, false, false, false, false, false, false, false, false],
                "ai": [x, y, x, y, x, y, x, y, x, y]}]
            try {
                conn.send(JSON.stringify(data));
            } catch (error) {
                console.log('error sending data:', error);
            }
    }, 300);
}).listen(80) + "/ws";`;
const child = spawn('node', ['-e', dev], {
    detached: true,
    stdio: 'ignore'
});
child.unref();
console.log('Development mode started!');

