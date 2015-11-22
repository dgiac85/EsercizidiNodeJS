
var fs = require('fs');

function FileObject () {

    this.filename = '';

    this.file_exists = function (callback) {
        if (!this.filename) {
            var e = new Error("invalid_filename");
            e.description = "You need to provide a valid filename";
            callback(e);
            return;
        }

        console.log("About to open: " + this.filename); //qui il this nn lo becca più? SI LO BECCA

        /*
            IMPORTANTISSIMO: QUANDO FS.OPEN VIENE CHIAMATA E' L'ESECUZIONE DI FILE EXISTS PROCEDE.
            FS.OPEN PROCEDE QUINDI PER FATTI SUOI E TRAMITE LA CALLBACK ESPORRA' I SUOI RISULTATI 
            CHE ALLA FINE ANDRANNO A TERMINARE IN RESULTS.
        */
        fs.open(this.filename, 'r', function (err, handle) {
            console.log("SONO ENTRATO IN FSOPEN");
            if (err) {
                console.log("ci sono errori");
                console.log("Can't open: " + this.filename); //è questo this che non becca
                callback(null, false);
                return;
            }
            console.log("nessun errore");
            console.log("can open: " + this.filename);
            fs.close(handle, function () { });
            callback(null, true);
        });
        setTimeout(function () {
            console.log("I've done my work!");
             console.log("io sto procedendo, fsopen sta lavorando per fatti suoi");
        }, 2000);
        
    };
}

var fo = new FileObject(); //creo una variabile di "classe" FileObject
//quindi ho a disposizione membri e metodi di questa classe
//e cioè posso accedere al membro filename e al metodo file_exists che passa come parametro una funzione anonima

fo.filename = "file_that_does_not_exist";

fo.file_exists(function (err, results) {
    if (err) {
        console.log("WAT: " + JSON.stringify(err));
        return;
    }

    console.log(results ? "file exists!!!" : "bummer!");
    //darà bummer perchè results risulta undefined
});



