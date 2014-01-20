var http = require("http");
var fs = require("fs");
var lame = require("lame");
var Speaker = require("speaker");
var querystring = require("querystring");
var path = require("path");

var audioPath = process.cwd();
if (process.argv.length > 2) {
    audioPath = process.argv[2];
}

var speaker = new Speaker();

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

var handleRequest = function(request, response) {
    if (request.url === "/favicon.ico") {
    }
    else if (request.url === "/")
        returnIndex(request, response);
    else if (request.url.startsWith("/play")) {
        handlePlayRequest(request, response);
    }
    else
        return404(request, response);
};

var handlePlayRequest = function(request, response) {

    var getFullMp3PathFromRequest = function(request) {
        var name = querystring.unescape(request.url.substring(6));
        return path.join(audioPath, name);
    };

    var mp3Path = getFullMp3PathFromRequest(request);
    var stream = fs.createReadStream(mp3Path).pipe(new lame.Decoder());

    stream.on('end', function() {
        //must use a 302 (temp redirect) since a 301 (perm redirect) will
        //cause the browser to directly send further requests to the new location, bypassing the old url entirely
        response.writeHead(302, { 'Location': '/' });
        response.end();
    });

    stream.on('readable', function() {
        var chunk;
        while (null !== (chunk = stream.read())) {
            speaker.write(chunk);
        }
    });
};

var returnIndex = function(request, response) {

    var getLinkText = function(name) {
        return name.substring(0, name.length - 4);
    };

    var getMp3Paths = function() {
        var fileNames = fs.readdirSync(audioPath);

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

var return404 = function(request, response) {
    response.writeHead(404, {"Content-Type": "text/plain"});
    var message = "Potylerto can't help you with this";
    response.write(message);
    response.end();
};

http.createServer(function(request, response) {
    handleRequest(request, response);
}).listen(8000);
