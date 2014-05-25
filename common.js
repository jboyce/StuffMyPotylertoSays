var getAudioPath = function() {
    var audioPath = process.cwd();
    if (process.argv.length > 2) {
        audioPath = process.argv[2];
    }

    return audioPath;
}

exports.audioPath = getAudioPath();