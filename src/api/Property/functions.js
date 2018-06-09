var service = {};

service.getPriceCategory = getPriceCategory;
service.getCommercialPrice = getCommercialPrice;

var configA = require('./config');

module.exports = service;

/**
 * Getting taxation values from config.json
 * @param {*} propertyType 
 * @param {*} subType 
 * @param {*} n 
 * @param {*} callback 
 */
function getPriceCategory(propertyType, subType, n, callback) {
    var range
    if (subType == "") {
        console.log('params subtype not present' + propertyType + " " + n);
        range = configA.propertytype[propertyType].range;
        var arr = [];
        for (var index = 0; index < range.length; index++) {

            if (n <= range[index].value && typeof range[index].value == "number") {
                arr.push(range[index].category);
            }
            if (typeof range[index].value == "string") {

                arr.push(range[index].category);
            };

        }
        console.log('Category ==> ' + arr[0]);
        let category = arr[0];
        let price = configA.propertytype[propertyType][category];
        console.log("price (Rupee) per year==> " + price);
        callback(price);
    }
    else {
        console.log('params subtype present' + propertyType + " " + subType + " " + n);
        range = configA.propertytype[propertyType][subType].range;
        var arr = [];
        for (var index = 0; index < range.length; index++) {

            if (n <= range[index].value && typeof range[index].value == "number") {
                arr.push(range[index].category);
            }
            if (typeof range[index].value == "string") {

                arr.push(range[index].category);
            };

        }
        console.log('Category ==> ' + arr[0]);
        let category = arr[0];
        let price = configA.propertytype[propertyType][subType][category];
        console.log("price (Rupee) per year==> " + price);
        callback(price);
    }
}

/**
 * Getting commercial prcentage
 * @param {*} coveredArea 
 * @param {*} callback 
 */
function getCommercialPrice(coveredArea, callback) {
    console.log('Getting  price of commerical space..');

    let range = configA.propertytype['commercial']['commercialspace'].range;
    var arr = [];
    for (var index = 0; index < range.length; index++) {

        if (coveredArea <= range[index].value && typeof range[index].value == "number") {
            arr.push(range[index].category);
        }
        if (typeof range[index].value == "string") {
            arr.push(range[index].category);
        };
    }
    console.log('Category ==> ' + arr[0]);
    let category = arr[0];
    let price = configA.propertytype['commercial']['commercialspace'][category];
    // console.log('Price as per the category ==> ' + price);
    callback(price);

}