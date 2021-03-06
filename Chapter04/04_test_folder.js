
var http = require('http'),
    fs = require('fs');

function load_album_list(callback) {
    // we will just assume that any directory in our 'albums'
    // subfolder is an album.
    fs.readdir("albums",function (err, files) {
            if (err) {
                callback(err);
                return;
            }

            var only_dirs = [];
			
			//iterator(0); //la metto commentata perchè la richiamo per la prima volta con il metodo
																										// (function iterator(index){.....})(0)	

			//è una ricorsiva - mettendo la funzione tra parentesi e con il parametro a 0 si chiama per la prima volta
            (function iterator(index) {
				console.log("index:"+index+"\n");
                if (index == files.length) {
                    callback(null, only_dirs);
                    return;
                }

                fs.stat("albums/" + files[index],function (err, stats) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        if (stats.isDirectory()) {
                            only_dirs.push(files[index]);
                        }
                        iterator(index + 1)
                    }                    
                );
            })(0);
        }
    );
}

function handle_incoming_request(req, res) {
    console.log("INCOMING REQUEST: " + req.method + " " + req.url);
    load_album_list(function (err, albums) {
        if (err) {
            res.writeHead(500, {"Content-Type": "application/json"});
            res.end(JSON.stringify(err) + "\n");
            return;
        }

        var out = { error: null,
                    data: { albums: albums }};
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(out) + "\n");
    });
}

var s = http.createServer(handle_incoming_request);

s.listen(8080);

