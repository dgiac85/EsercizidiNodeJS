
var http = require('http');

function handle_incoming_request(req, res) {
	//sarà un testo lunghissimo in cui compariranno le caratteristiche della request e della response
    console.log("---------------------------------------------------");
    console.log(req.headers);
    console.log("---------------------------------------------------");
    console.log(res);
    console.log("---------------------------------------------------");
    res.writeHead(200, { "Content-Type" : "application/json" }); //chiamata al metodo writeHead
    res.end(JSON.stringify( { error: null }) + "\n"); //chiamata al metodo head tramite req e res
}


var s = http.createServer(handle_incoming_request);
s.listen(8080);

