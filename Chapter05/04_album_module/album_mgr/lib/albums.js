
var fs = require('fs'), 
    album = require('./album.js');


exports.version = "1.0.0";

/*
    albums è una funzione che restiuisce un oggetto callback
    nell'oggetto callback ci può essere un errore oppure ci può essere l'oggetto 
    con i dati richiesti ovvero l'insieme delle cartelle
    All'interno della funzione albums viene richiamata la funzione asincrona readdir
    questo readdir accetta il parametro root al quale si aggiunge il path /albums
    la funzione readdir invia una callback function(err,files){} restituendo un oggetto files
    quest'ultima callback gestisce l'eventuale errore
    oppure i files in arrivo. i files in arrivo vengono gestiti con una funzione iterator
    il file iterator becca tutti i file presenti nella root
    Se sono directory (il controllo è effettuato attraverso l'oggetto stats dell'asincrona fs.stat)
    li inserisce in album_list con una push (creando un'oggetto album...che sarà utilizzato nel test di lettura test_album_mgr)
    in test_album_mgr infatti è possibile utilizzare il metodo photos che ci permette di leggere le foto all'
    interno dell'album. l'accesso a photos avviene all'interno del test!
    album_list viene poi inserita nella callback
*/

exports.albums = function (root, callback) {
    // we will just assume that any directory in our 'albums'
    // subfolder is an album.
    fs.readdir(
        root + "/albums",
        function (err, files) {
            if (err) {
                callback(err);
                return;
            }

            var album_list = [];

            (function iterator(index) {
                if (index == files.length) {
                    callback(null, album_list);
                    return;
                }

                fs.stat(
                    root + "albums/" + files[index],
                    function (err, stats) {
                        console.log((index+1)+"° contenuto della cartella: "+files[index]);
                        if (err) {
                            callback(make_error("file_error",
                                                JSON.stringify(err)));
                            return;
                        }
                        if (stats.isDirectory()) {
                            var p = root + "albums/" + files[index];
                            album_list.push(album.create_album(p));
                        }
                        iterator(index + 1)
                    }                    
                );
            })(0);
        }
    );
};

function make_error(err, msg) {
    var e = new Error(msg);
    e.code = err;
    return e;
}

