function sequencePromiseCallbacks(promiseCallbacks) {
    return _.reduce(promiseCallbacks, (lastPromise, promiseCallback) => {
        return lastPromise.then((v) => {
            return promiseCallback(v);
        }, (err) => {
            return Promise.reject(err);
        });
    }, Promise.resolve());
}

module.exports = {
    sequencePromiseCallbacks: sequencePromiseCallbacks
}