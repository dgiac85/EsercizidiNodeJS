
var http = require('http'),
    fs = require('fs');


function load_album_list(callback) {
    // we will just assume that any directory in our 'albums'
    // subfolder is an album.
    fs.readdir(
        "albums",
        function (err, files) {
            if (err) {
                callback(make_error("file_error",  JSON.stringify(err)));  //genero l'errore con la funzione make_error
                return;
            }

            var only_dirs = [];

            (function iterator(index) {
                if (index == files.length) {
                    callback(null, only_dirs);
                    return; //esce dalla funzione?
                }

                fs.stat(
                    "albums/" + files[index],
                    function (err, stats) {
                        if (err) {
                            callback(make_error("file_error",
                                                JSON.stringify(err)));
                            return;
                        }
                        if (stats.isDirectory()) {
                            var obj = { name: files[index] };
                            only_dirs.push(obj);
                        }
                        iterator(index + 1)  //applicazione della ricorsione per fare andare in ordine le callback
                    }                    
                );
            })(0);
        }
    );
}

function load_album(album_name, callback) {
    // we will just assume that any directory in our 'albums'
    // subfolder is an album.
    fs.readdir("albums/" + album_name,function (err, files) {
            if (err) {
                if (err.code == "ENOENT") {
                    callback(no_such_album());
                } else {
                    callback(make_error("file_error",
                                        JSON.stringify(err)));
                }
                return;
            }

            var only_files = [];
            var path = "albums/" + album_name + "/";

            (function iterator(index) {
                if (index == files.length) {
                    var obj = { short_name: album_name,
                                photos: only_files };
                    callback(null, obj);
                    return;
                }

                fs.stat(path + files[index],function (err, stats) {
                        if (err) {
                            callback(make_error("file_error",
                                                JSON.stringify(err)));
                            return;
                        }
                        if (stats.isFile()) {
                            var obj = { filename: files[index],
                                        desc: files[index] };
                            only_files.push(obj);
                        }
                        iterator(index + 1)
                    }                    
                ); //chiusura lista parametri stat()
            })(0);
        }
    ); //chiusura lista parametri readdir()
}

// prima funzione chiamata
function handle_incoming_request(req, res) {
    console.log("INCOMING REQUEST: " + req.method + " " + req.url);
    if (req.url == '/albums.json') {
        handle_list_albums(req, res);
    } else if (req.url.substr(0, 7) == '/albums'
               && req.url.substr(req.url.length - 5) == '.json') {
        handle_get_album(req, res);
    } else {
        send_failure(res, 404, invalid_resource());
    }
}

// seconda funzione chiamata
function handle_list_albums(req, res) {
    load_album_list(function (err, albums) {
        if (err) {
            send_failure(res, 500, err);
            return; 
        }

        send_success(res, { albums: albums });
    });
}
//Terza funzione chiamata
function handle_get_album(req, res) {
    // format of request is /albums/album_name.json
	console.log("URL richiesto: "+req.url);
	console.log("lunghezza URL: "+req.url.length);
	console.log("stringa ottenuta:"+req.url.substr(7, req.url.length - 12));
    var album_name = req.url.substr(7, req.url.length - 12); //serve per beccare il nome della cartella
    load_album(album_name,function (err, album_contents) {
            if (err && err.error == "no_such_album") {
                send_failure(res, 404, err);
            }  else if (err) {
                send_failure(res, 500, err);
            } else {
                send_success(res, { album_data: album_contents });
            }
        }
    );
}


function make_error(err, msg) {
    var e = new Error(msg);
    e.code = err;
    return e;
}

// quarta funzione chiamata
function send_success(res, data) {
    res.writeHead(200, {"Content-Type": "application/json"});
    var output = { error: null, data: data };
    res.end(JSON.stringify(output) + "\n");
}
// Quinta funzione chiamata in caso di fallimento
function send_failure(res, code, err) {
    var code = (err.code) ? err.code : err.name;
    res.writeHead(code, { "Content-Type" : "application/json" });
    res.end(JSON.stringify({ error: code, message: err.message }) + "\n");
}


function invalid_resource() {
    return make_error("invalid_resource",
                      "the requested resource does not exist.");
}

function no_such_album() {
    return make_error("no_such_album",
                      "The specified album does not exist");
}


var s = http.createServer(handle_incoming_request);
s.listen(8080);

/*handle incoming request è la prima funzione ad esser chiamata
quindi in base all'url che ho richiesto viene gestito un controllo if/elseif/else

nell'if si soddisfa la richiesta di ottenere le cartelle contenute nell'album di foto 
______handle_list_albums(req, res);
			In questa funzione viene chiamata la funzione load_album_list(function (err, albums){...});
			______load_album_list(function (err, albums){...})
						questa funzione è una funzione asincrona che nel caso di callback errata invia un send_failure
						altrimenti invia un send_success. La callback si produce andando a fare una fs.readdir ed una fs.stat
						la fs.stat la si fa all'interno di una funzione ricorsiva iterator per risolvere la problematica relativa alla coda
						di eventi di Node.js e quindi alla sua natura non bloccante (thread singolo)
________________________________________________________________________________________
nell'elseif si soddisfa la richiesta di ottenere i file contenuti in una certa cartella
______ handle_get_album(req, res);
			In questa funzione viene chiamata load_album
			______load_album(album_name, callback){......});
						questa funzione si becca il nome dell'album preciso dell'album e fa più o meno le stesse cose della precedente				
________________________________________________________________________________________
*/


