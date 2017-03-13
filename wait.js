const _ = require('lodash');

function waitForKeyPress(message) {
    return new Promise((resolve, reject) => {
        if (message != '') {
            console.log(message);
            console.log('');
        }
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.once('data', () => {
            process.stdin.setRawMode(false);
            resolve();
        });
    });
}

function randomWait(minDuration, maxDuration) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, _.random(minDuration, maxDuration));
    });
}

module.exports = {
    randomWait: randomWait,
    waitForKeyPress: waitForKeyPress
}