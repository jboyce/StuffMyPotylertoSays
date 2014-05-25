var common = require("../common");
var fs = require("fs");
var lame = require("lame");
var path = require("path");
var querystring = require("querystring");
var Speaker = require("speaker");

var speaker = new Speaker();

exports.playBackSaying = function(request, response){
    //res.render('index', { title: 'Express' });
    var getFullMp3PathFromRequest = function(request) {
        var name = querystring.unescape(request.url.substring(6));
        return path.join(common.audioPath, name);
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
