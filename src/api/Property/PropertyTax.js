/**
 * Tax calculation on the basis of given parameters.
 */

var express = require('express');
var router = express.Router();
var configA = require('./config');

router.get('/calculate', taxCalculator);

module.exports = router;

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */

function taxCalculator(req, res) {
    console.log('Tax calculation started..');
    res.send('done');
    getTaxValues("Residential", "House", 9680);
}


function getTaxValues(propertyType, subType, coveredArea) {
    console.log('get values started ..');

    console.log('params ' + propertyType + " " + subType + " " + coveredArea);
    // console.log(JSON.stringify(configA.PropertType[propertyType][subType].range.length));
    let range = configA.PropertType[propertyType][subType].range;
    var arr = [];
    for (var index = 0; index < range.length; index++) {

        if (coveredArea <= range[index].value && typeof range[index].value == "number") {
            // console.log('Covered aread lies here .. ');
            arr.push(range[index].category);
        }
        if (typeof range[index].value == "string") {
            
            arr.push(range[index].category);
        };
    }
    console.log(arr[0]);
    let category = arr[0];
    let price = configA.PropertType[propertyType][subType][category];
    console.log(price);
}