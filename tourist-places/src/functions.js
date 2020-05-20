/**
 * @description Get data array from json-file whith path name
 * @async
 * @param {string} path name of json-file
 * @returns {object} data array
 */
function getData(path) {
    return new Promise(function(resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', path, true);
        xhr.onload = () => {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
        }
        xhr.onerror = () => reject();
        xhr.send(null);
    })
}
// eslint-disable-next-line
exports.getData = getData;

/**
 * @description Get distance between two points whith latitude (lat1, lat2) and longitude (long1, long2)
 * @param {number} lat1 latitude of first point
 * @param {number} lat2 latitude of first point
 * @param {number} long1 longitude of second point
 * @param {number} long2 longitude of second point
 * @returns {number} distance between two points
 */
function getDistHaversinusFormula(lat1, lat2, long1, long2) {
    const R = 6371;
    const lat1Radian = (lat1 * 3.14 / 180);
    const lat2Radian = (lat2 * 3.14 / 180);
    const long1Radian = (long1 * 3.14 / 180);
    const long2adian = (long2 * 3.14 / 180);

    const forSinLat = (lat2Radian - lat1Radian) / 2;
    const forSinLong = (long2adian - long1Radian) / 2;

    const squareRoot = ((Math.sin(forSinLat) ** 2) + Math.cos(lat1Radian) * Math.cos(lat2Radian) * (Math.sin(forSinLong) ** 2)) ** (1 / 2);

    const distance = 2 * R * Math.asin(squareRoot);

    return distance;
}
// eslint-disable-next-line
exports.getDistHaversinusFormula = getDistHaversinusFormula;

/**
 * @description Get the length of the walking path between two points in meters
 * @param {number} distance distance of path between two points
 * @returns {number} length of the walking path between two points in meters
 */
function getWalkingDistance(distance) {
    return Math.round(1440 * distance);
}
// eslint-disable-next-line
exports.getWalkingDistance = getWalkingDistance;

/**
 * @description Get the time of the walking path between two points in minutes
 * @param {number} walkingDistance length of the walking path between two points in meters
 * @returns {number} length of the walking path between two points in minutes
 */
function getWalkingTime(walkingDistance) {
    return Math.round(0.015 * walkingDistance);
}
// eslint-disable-next-line
exports.getWalkingTime = getWalkingTime;