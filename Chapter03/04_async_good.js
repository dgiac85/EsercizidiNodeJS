
var fs = require('fs');

fs.open('info.txt', 'r',function (err, handle) { //si apre la coda di eventi di node
        var buf = new Buffer(100000);
        fs.read(handle, buf, 0, 100000, null, function (err, length) {
                console.log(buf.toString('utf8', 0, length));
                fs.close(handle, function () { /* don't care */ }); //chiusura metodo close
            }
        ); //chiusura metodo read
    }
); //chiusura metodo open
