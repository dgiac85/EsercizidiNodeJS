var http = require("http"); //modulo http

function process_request(req, res) {
    var body = 'Thanks for calling!\n';
    var content_length = body.length;
    res.writeHead(200, {
            'Content-Length': content_length,
            'Content-Type': 'text/plain'
    });
    res.end(body);

}

var s = http.createServer(process_request);//è una sorta di handler
console.log("adesso apre listen");



s.listen(8080);
