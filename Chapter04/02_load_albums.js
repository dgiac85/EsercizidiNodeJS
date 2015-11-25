
var http = require('http'),
    fs = require('fs'); //becco il modulo per la lettura del file system

function load_album_list(callback) {
    // we will just assume that any directory in our 'albums'
    // subfolder is an album.
	//fs.readdir("nome_folder",funzione per la gestione della callback)
    fs.readdir("albums",function (err, files) {
            if (err) {
                callback(err); //gli passo l'errore e basta
                return;
            }
            callback(null, files); //gli passo un errore pari a null
        }
    );
}

function handle_incoming_request(req, res) {
    console.log("INCOMING REQUEST: " + req.method + " " + req.url);
    load_album_list(function (err, albums) {
        if (err) {
            res.writeHead(500, {"Content-Type": "application/json"}); //scrivo l'header della response errata
            res.end(JSON.stringify(err) + "\n");
            return;
        }
		
		//preparo l'output
        var out = { error: null,data: { albums: albums }};
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(out) + "\n");
    });
}

var s = http.createServer(handle_incoming_request);

console.log("in attesa di richieste dal client...");
/*Il server chiama handle_incoming_request quindi questa 
chiama asincronicamente load_album_list e basta non fa nient'altro
Quindi quello che ci si deve aspettare è la callback gestita in load_album_list
*/

s.listen(8080);

