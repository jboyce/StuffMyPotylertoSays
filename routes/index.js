var fs = require("fs");
var common = require("../common");

var getMp3Paths = function() {
    var fileNames = fs.readdirSync(common.audioPath);

    return fileNames.filter(function(name) {
        return name.endsWith(".mp3");
    });
};

exports.index = function(request, response){
    var pathsWithLinks = [];
    var mp3Paths = getMp3Paths();

    mp3Paths.forEach(function (path) {
        var pathWithLink = {
            text: path.substring(0, path.length - 4),
            href: '/play/' + encodeURIComponent(path).replace(/'/g, "%27")
        };
        pathsWithLinks.push(pathWithLink);
    });

  response.render('index', { mp3Paths : pathsWithLinks });
};
