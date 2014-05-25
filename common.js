var getAudioPath = function() {
    var audioPath = process.cwd();
    if (process.argv.length > 2) {
        audioPath = process.argv[2];
    }

    return audioPath;
}

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

exports.audioPath = getAudioPath();