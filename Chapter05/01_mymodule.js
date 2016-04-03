//per ottenere un'istanza bisogna creare una classe FACTORY

function Greeter2 (language) {

    this.language = language;
    console.log("language="+this.language);

    this.greet = function () {
        switch (this.language) {
            case "en": console.log("Hello!"); break;
            case "de": console.log("Hallo!"); break;
            case "jp": console.log("こんにちは!"); break;
            default: console.log("No speaka that language"); break;
        }
    };

    this.greet();

}


function Greeter (language){
    this.language=language;

    this.greet=function(){
        switch (this.language){
            case "en": return "Hello!";
            case "de": return "Hallo!";
            case "jp": return "こんにちは!";
            default:return "No speaka that language";
        }
    }
}

exports.hello_world = function () {
    console.log("Hello World");
}

exports.goodbye = function () {
    console.log("Bye bye!");
}

exports.greeter = function (lang) {
    return new Greeter2(lang);
}
