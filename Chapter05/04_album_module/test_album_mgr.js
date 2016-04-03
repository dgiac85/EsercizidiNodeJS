
var amgr = require('./album_mgr');
//amgr becca il file albums che ha bisogno di albums

/*
si prende la cartella album_mgr
attraverso amgr.albums(root,callback) viene richiamata la fuznione albums
La funzione albums alla chiamata attende una callback. 
Viene perciò richiamata la funzione di callback (function (err, albums){...})
Tale funzione di callback richiama una iterator ricorsiva per annullare
l'effetto di asincronismo, dato che quando si richiama il metodo photos
che è possibile ottenere con albums[index] che contiene l'accesso al metodo photos della 
della classe Album. Il metodo photos lascia una callback in cui ci può essere
un errore o un oggetto photos. Se ci sta l'errore si stringifizza 
se no si accetta l'oggetto photos indicizzato da albums


*/

amgr.albums('./', function (err, albums) {
    if (err) {
        console.log("Unexpected error: " + JSON.stringify(err));
        return;
    }

    //ricorsiva per la questione dell'asincronia
    (function iterator(index) {
        if (index == albums.length) {
            console.log("Done");
            return; //esce dalla ricorsiva
        }

        albums[index].photos(function (err, photos) {
            if (err) {
                console.log("Err loading album: " + JSON.stringify(err));
                return;
            }

            console.log(albums[index].name);
            console.log(photos);
            console.log("");
            iterator(index + 1);
        });
    })(0);
});

