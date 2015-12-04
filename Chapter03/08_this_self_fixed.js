
var fs = require('fs');

function FileObject () {

    this.filename = '';

    this.file_exists = function (callback) {
       

        /*
            IMPORTANTISSIMO: QUANDO FS.OPEN VIENE CHIAMATA E' L'ESECUZIONE DI FILE EXISTS PROCEDE.
            FS.OPEN PROCEDE QUINDI PER FATTI SUOI E TRAMITE LA CALLBACK ESPORRA' I SUOI RISULTATI 
            CHE ALLA FINE ANDRANNO A TERMINARE IN RESULTS.
        */


         var self = this;
        /*
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

        /*setTimeout(function () {
            console.log("I've done my work!");
             console.log("io sto procedendo, fsopen sta lavorando per fatti suoi");
        }, 2000);*/
    };
}

var fo = new FileObject();
fo.filename = "file_che_non_esiste.txt";
//fo.filename = "info.txt";

fo.file_exists(function (err, results) {
    if (err) {
        console.log("Aw, bummer: " + JSON.stringify(err)); //si JSONIZZERA' l'errore
        return;
    }

    //results in questo caso non sarà undefined se arriva a questo punto

    console.log("file exists!!!");
});



