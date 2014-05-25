var fs = require("fs");
var common = require("../common");

exports.index = function(request, response){
  //res.render('index', { title: 'Express' });
    var getLinkText = function(name) {
        return name.substring(0, name.length - 4);
    };

    var getMp3Paths = function() {
        var fileNames = fs.readdirSync(common.audioPath);

        return fileNames.filter(function(name) {
            return name.endsWith(".mp3");
        });
    };

    response.writeHead(200, {"Content-Type": "text/html"});

    var indexTemplate = "<html><head><title>Stuff Potylerto Says</title></head><body>?</body></html>";

    var links = [];
    var aTemplate = "<a href='/play/?'>{text}</a><br/>\n";
    var mp3Names = getMp3Paths();
    mp3Names.forEach(function (name) {
        var encodedName = encodeURIComponent(name).replace(/'/g, "%27");
        links.push(aTemplate.replace(/\?/g, encodedName).replace("{text}", getLinkText(name)))
    });

    var allLinks = links.join("");
    var message = indexTemplate.replace("?", allLinks);
    response.write(message);
    response.end();
};

if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    }
}

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str){
        return this.indexOf(str) == 0;
    };
}
