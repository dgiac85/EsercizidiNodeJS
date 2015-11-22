
var fs = require('fs');

function FileObject () {

    this.filename = '';

    this.file_exists = function (callback) {
        var self = this;

        /*
            IMPORTANTISSIMO: QUANDO FS.OPEN VIENE CHIAMATA E' L'ESECUZIONE DI FILE EXISTS PROCEDE.
            FS.OPEN PROCEDE QUINDI PER FATTI SUOI E TRAMITE LA CALLBACK ESPORRA' I SUOI RISULTATI 
            CHE ALLA FINE ANDRANNO A TERMINARE IN RESULTS.
        */

        if (!this.filename) {
            var e = new Error("invalid_filename");
            e.description = "You need to provide a valid filename";
            callback(e);
            return;
        }

        console.log("About to open: " + self.filename);
        fs.open(this.filename, 'r', function (err, handle) {
            console.log("SONO ENTRATO IN FSOPEN");
            if (err) {
                console.log("Can't open: " + self.filename);
                callback(null, false); //la callback serve per gestire la chiamata a file_exists sotto
                return;
            }

            fs.close(handle, function () { });
            callback(null, true);
        });

        setTimeout(function () {
            console.log("I've done my work!");
             console.log("io sto procedendo, fsopen sta lavorando per fatti suoi");
        }, 2000);
    };
}

var fo = new FileObject();
fo.filename = "file che non esiste";

fo.file_exists(function (err, results) {
    if (err) {
        console.log("Aw, bummer: " + JSON.stringify(err)); //si JSONIZZERA' l'errore
        return;
    }

    //results in questo caso non sarà undefined se arriva a questo punto

    console.log("file exists!!!");
});



