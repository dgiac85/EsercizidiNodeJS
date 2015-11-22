

var fs = require('fs');

fs.open(
    'info.txt', 'r',
    function (err, handle) {
        if (err) {
            console.log("ERROR: " + err.code + " (" + err.message + ")");
            return; //uscita dal programma nel caso ci fossero errori
        }
        else{
            console.log("ENTRA NELL'ELSE");
            //è possibile inserire un else anche 
            var buf = new Buffer(100000);
            fs.read(
                handle, buf, 0, 100000, null,
                function (err, length) {
                    if (err) {
                        console.log("ERROR: " + err.code
                                    + " (" + err.message + ")");
                        return;//uscita dal programma nel caso ci fossero errori
                    }
                    console.log(buf.toString('utf8', 0, length));
                    fs.close(handle, function () { /* don't care */ });
                }
            );
        }
    }
);

