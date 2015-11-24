
var http = require('http');

function handle_incoming_request(req, res) { //handle_incoming_request è il nome della funzione in ascolto sulla 8080
    console.log("INCOMING REQUEST: " + req.method + " " + req.url);
    res.writeHead(200, { "Content-Type" : "application/json" });
    res.end("\n"+JSON.stringify( { error: 'null' }) + "\n");
}


var server = http.createServer(handle_incoming_request);

server.listen(8080);

