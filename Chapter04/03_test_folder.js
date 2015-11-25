
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

            var only_dirs = ["ciao","caro!!"];
			
			/*
			viene chiamata la funzione asincrona fs.stat dando come parametro il path albums
			e il nome di quello che contiene al suo interno. fs.stat ritorna una callback 
			sicuramente in fs.stat ci sta un ritorno del tipo callback(null,results) nel caso di risultato positivo
			PERO' CI STA UN ERRORE!! IL PROBLEMA RISIEDE NEL CICLO FOR IN CUI SI è FATTA LA 
			RICHIESTA AD FS.STAT
			
			e perchè questo succede??
			perchè quando si chiama la fs.stat si esce dal ciclo for e non viene atteso il risultato;
			
			only_dirs restituirà quello che ha cioè i valori "ciao" e "caro"!!
			
			COME RISOLVO IL PROBLEMA? CON LA RICORSIONE!
			*/
			
			
            for (var i = 0; files && i < files.length; i++) {
                fs.stat("albums/" + files[i],function(err, stats) { //stats è un argomento ottenuto nella callback di ritorno di fs.stat che è asincrona
                        if (stats.isDirectory()) {
                            only_dirs.push(files[i]);
                        }
                    }
                );
            }

            callback(null, only_dirs);
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

console.log("ciao caro, io attendo richieste...");

s.listen(8080);

