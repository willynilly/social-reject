function getRandomElement(array, probabilityDistribution) {
    let r = Math.random();
    let tot = 0;
    for (let i = 0; i < probabilityDistribution.length; i++) {
        tot += probabilityDistribution[i];
        if (r <= tot) {
            return array[i];
        }
    }
    return array[array.length - 1];
}

module.exports = {
    getRandomElement: getRandomElement
}