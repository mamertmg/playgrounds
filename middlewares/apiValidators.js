module.exports.isLatitude = lat => {
    return lat && !isNaN(lat) && Number(lat) >= -90.0 && Number(lat) <= 90.0;
};

module.exports.isLongitude = lng => {
    return lng && !isNaN(lng) && Number(lng) >= -180.0 && Number(lng) <= 180.0;
};