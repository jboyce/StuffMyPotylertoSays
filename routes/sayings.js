"use strict";

var fs = require("fs");
var common = require("../common");
var walkdir = require("walkdir");

var getMp3PathInfos = function() {
    var roothAudioPathLength = fs.realpathSync(common.audioPath).length;
    var pathMap = {};
    var mainPath = "main";

    var paths = walkdir.sync(common.audioPath);
    paths.forEach(function(path) {
        if (path.endsWith(".mp3")) {
            var relativePath = path.substring(roothAudioPathLength);
            var separator = relativePath[0];
            var pathParts = relativePath.split(separator);
            var fileName = pathParts[pathParts.length - 1];
            pathParts.pop();
            pathParts.shift(); //remove the first element since it is empty because of the leading separator in the path
            var key;
            if (pathParts.length == 0) {
                key = mainPath;
            }
            else {
                key = pathParts.join(separator);
            }

            pathMap[key] = pathMap[key] || [];
            var folder = (key === mainPath) ? "" : key + separator;
            pathMap[key].push({
                text: fileName.substring(0, fileName.length - 4),
                href: '/play/' + folder + encodeURIComponent(fileName).replace(/'/g, "%27")
            });
        }
    });

    return pathMap;
};

exports.sayings = function(request, response){
    var mp3PathInfos = getMp3PathInfos();
    response.json(mp3PathInfos);
};
