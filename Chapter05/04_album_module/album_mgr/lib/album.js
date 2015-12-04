var path = require('path'),
    fs = require('fs');

//CLASSE BASE ALBUM è una factory
function Album (album_path) {
    this.name = path.basename(album_path);
    this.path = album_path;
}


//con prototype le istanze album useranno tutte la stessa implementazione
//prototype è solo un modo per impostare le proprietà su tutte le istanzae della classe Album
Album.prototype.name = null;
Album.prototype.path = null;
Album.prototype._photos = null; //_photos è visto come membro

Album.prototype.photos = function (callback) { //photos invece come metodo
    
    console.log("valore di this._photos: "+this._photos);
    if (this._photos != null) {
        callback(null, this._photos);
        return;
    }
    //il self è utile a memorizzare il riferimetno all'oggetto durante la
    //gestione dell'IO asincrono non bloccante
    //self mi aiuta a memorizzare il riferimento all'oggetto
     /* dal capitolo 3
            la maggiorparte delle volte, quando una funzione è nidificata in un'altra
            eredita l'ambito di quella principale e può accedere alle stesse variabili
            in questo caso perchè la funzione di callback nidificata non prende 
            il valore corretto della proprietà filename?
            il problema risiede nella relazione tra la parola chiavve this e le funzioni
            di callback asincrone.
            Non dimenticate che nel momento in cui si chiama una funzione come fs.open, questa 
            si inizializza, fa una chiamata alla funzione integrata nel sistema operativo
            e aggiunge il callback alla coda degli eventi
            L'esecuzione torna subito alla funzione file_exists, quindi termina. 
            Quando fs.open completa il lavoro e Node lancia il callback,
            non si è più nel contesto della classe FileObject e sarà utilizzato
            un nuovo puntatore this. E perchè non si è più nel contesto della classe
            FileObject...perchè la funzione è praticamente terminata.
            La cattiva notizia è che si è perso il puntatore this che fa riferimento
            alla classe FileObject. Quella buona è che il callback per fs.open
            ha ancora l'ambito corretto. Ambito corretto significa che fs.open vede la variabile self
            perchè è stata dichiarata in un contesto padre. This invece è stato perso!
            Una soluzione comune è salvare il puntatore this iu una variabile chiamata self
            
        */
    var self = this;

    //in pratica qui si legge una elle cartelle di album
    //si usa self per non perdere il riferimento

    //readdir è un'asincrona e come al solito ritorna il risultato in files
    //tale risultato viene gestito all'interno della funzione di callback
    fs.readdir(
        self.path,
        function (err, files) {
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

            (function iterator(index) {
                if (index == files.length) {
                    callback(null, only_files);
                    //la callback finale invia l'oggetto only_files
                    //e lo invia in questo caso nella funzione di test
                    //utile ad eseguire la lettura dei files
                    return;
                }

                fs.stat(
                    self.path + "/" + files[index],
                    function (err, stats) {
                        if (err) {
                            callback(make_error("file_error",
                                                JSON.stringify(err)));
                            return;
                        }
                        //si controlla la presenza di file
                        if (stats.isFile()) {
                            only_files.push(files[index]);
                        }
                        iterator(index + 1)
                    }                    
                );
            })(0);
        }
    );
};


//espongo il metodo per creare un album inserendo il path
exports.create_album = function (path) {
    return new Album(path);
};


function make_error(err, msg) {
    var e = new Error(msg);
    e.code = err;
    return e;
}


function no_such_album() {
    return make_error("no_such_album",
                      "The specified album does not exist");
}
